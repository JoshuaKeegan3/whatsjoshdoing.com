import { httpAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { readStrings } from "./validate";

/** The current reading. `projectEvents` holds exactly one row. */
export const latest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projectEvents").order("desc").first();
  },
});

const source = v.union(v.literal("zed"), v.literal("t3"), v.literal("zen"));
const status = v.union(v.literal("online"), v.literal("offline"));

/**
 * Written by the Omarchy project-sync watcher via /api/project.
 *
 * `source` is kept because the three name things at different granularities: a
 * T3 project is a coarse grouping such as "Masters", a Zed workspace is the
 * repo, such as "a3", and "zen" reports browsing as the activity
 * "researching". Without it they are indistinguishable in the readout.
 *
 * `fileName` is the file open in Zed, and empty for every other source.
 *
 * Only the current reading is rendered, so the previous row is replaced rather
 * than kept. The table is a snapshot, not a timeline.
 */
export const record = internalMutation({
  args: {
    status,
    source,
    projectName: v.string(),
    fileName: v.string(),
    projectPath: v.string(),
    worktrees: v.array(v.string()),
    sessionId: v.string(),
    startedAt: v.string(),
    machineId: v.string(),
    occurredAt: v.string(),
  },
  handler: async (ctx, args) => {
    for (const previous of await ctx.db.query("projectEvents").collect()) {
      await ctx.db.delete(previous._id);
    }
    return await ctx.db.insert("projectEvents", args);
  },
});

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

/**
 * POST /api/project — records what Josh has open: a project in Zed or T3 Code,
 * or browsing in Zen.
 * Routed from http.ts; validation lives here so this module owns its own shape.
 */
export const projectEvent = httpAction(async (ctx, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON request" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "body must be a JSON object" }, { status: 400 });
  }
  const event = body as Record<string, unknown>;

  if (event.status !== "online" && event.status !== "offline") {
    return Response.json({ error: "status must be online or offline" }, { status: 400 });
  }
  if (event.source !== "zed" && event.source !== "t3" && event.source !== "zen") {
    return Response.json({ error: "source must be zed, t3 or zen" }, { status: 400 });
  }

  const fields = readStrings(event, [
    "projectName",
    "projectPath",
    "sessionId",
    "startedAt",
    "machineId",
    "occurredAt",
  ] as const);
  if (!fields) {
    return Response.json({ error: "missing or invalid event fields" }, { status: 400 });
  }
  if (!isStringArray(event.worktrees)) {
    return Response.json({ error: "worktrees must be an array of strings" }, { status: 400 });
  }

  const id = await ctx.runMutation(internal.project.record, {
    ...fields,
    status: event.status,
    source: event.source,
    worktrees: event.worktrees,
    // Optional, so a watcher older than file tracking keeps reporting.
    fileName: typeof event.fileName === "string" ? event.fileName : "",
  });
  return Response.json({ ok: true, id });
});
