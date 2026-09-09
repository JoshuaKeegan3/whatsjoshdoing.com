import { httpAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/** Newest event, i.e. the project currently open. */
export const latest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projectEvents").order("desc").first();
  },
});

/** Recent events, newest first, for a "what has Josh been in" timeline. */
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("projectEvents").order("desc").take(limit ?? 24);
  },
});

/** Newest events kept in `projectEvents`; older rows are trimmed on write. */
const HISTORY_LIMIT = 100;

const source = v.union(v.literal("zed"), v.literal("t3"));
const status = v.union(v.literal("online"), v.literal("offline"));

/**
 * Written by the Omarchy project-sync watcher via /api/project.
 *
 * `source` is kept because the two editors name things at different
 * granularities: a T3 project is a coarse grouping such as "Masters", a Zed
 * workspace is the repo, such as "a3". Without it the two are indistinguishable
 * in the timeline.
 *
 * History is kept rather than a single row snapshot, because opening a project
 * is a discrete, low frequency event and the sequence is the interesting part.
 * Growth is bounded by trimming to the newest HISTORY_LIMIT rows.
 */
export const record = internalMutation({
  args: {
    status,
    source,
    projectName: v.string(),
    projectPath: v.string(),
    worktrees: v.array(v.string()),
    sessionId: v.string(),
    startedAt: v.string(),
    machineId: v.string(),
    occurredAt: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("projectEvents", args);
    const stale = await ctx.db.query("projectEvents").order("desc").collect();
    for (const event of stale.slice(HISTORY_LIMIT)) {
      await ctx.db.delete(event._id);
    }
    return id;
  },
});

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

/**
 * Pulls `keys` off an untrusted object, returning null unless every one is a
 * string. The result is keyed by the requested names, so callers read fields
 * without casting.
 */
function readStrings<K extends string>(
  source: Record<string, unknown>,
  keys: readonly K[],
): Record<K, string> | null {
  const result = {} as Record<K, string>;
  for (const key of keys) {
    const value = source[key];
    if (typeof value !== "string") return null;
    result[key] = value;
  }
  return result;
}

/**
 * POST /api/project — records the project currently open in Zed or T3 Code.
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
  if (event.source !== "zed" && event.source !== "t3") {
    return Response.json({ error: "source must be zed or t3" }, { status: 400 });
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
  });
  return Response.json({ ok: true, id });
});
