import { httpAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/** Newest workspace event, i.e. the project currently open in Zed. */
export const latest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("zedWorkspaceEvents").order("desc").first();
  },
});

/** Recent workspace events, newest first, for a "what has Josh been in" timeline. */
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("zedWorkspaceEvents").order("desc").take(limit ?? 24);
  },
});

/** Newest events kept in `zedWorkspaceEvents`; older rows are trimmed on write. */
const HISTORY_LIMIT = 100;

/**
 * Written by the Omarchy zed-project-sync watcher via /api/zed-workspace.
 * Unlike `presence.record`, this keeps history: opening a project is a discrete,
 * low-frequency event, so the sequence of rows is a useful timeline rather than
 * noise. Growth is bounded by trimming to the newest HISTORY_LIMIT rows.
 */
export const record = internalMutation({
  args: {
    status: v.union(v.literal("online"), v.literal("offline")),
    projectPath: v.string(),
    projectName: v.string(),
    worktrees: v.array(v.string()),
    workspaceId: v.string(),
    openedAt: v.string(),
    machineId: v.string(),
    occurredAt: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("zedWorkspaceEvents", args);
    const stale = await ctx.db.query("zedWorkspaceEvents").order("desc").collect();
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
 * POST /api/zed-workspace — records which project is open in Zed.
 * Routed from http.ts; validation lives here so this module owns its own shape.
 */
export const workspaceEvent = httpAction(async (ctx, request) => {
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

  const fields = readStrings(event, [
    "projectPath",
    "projectName",
    "workspaceId",
    "openedAt",
    "machineId",
    "occurredAt",
  ] as const);
  if (!fields) {
    return Response.json({ error: "missing or invalid event fields" }, { status: 400 });
  }
  if (!isStringArray(event.worktrees)) {
    return Response.json({ error: "worktrees must be an array of strings" }, { status: 400 });
  }

  const id = await ctx.runMutation(internal.zed.record, {
    ...fields,
    status: event.status,
    worktrees: event.worktrees,
  });
  return Response.json({ ok: true, id });
});
