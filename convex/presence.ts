import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Most recent presence heartbeat written by the editor integration. */
export const latest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("t3PresenceEvents").order("desc").first();
  },
});

/**
 * Recent heartbeats, newest first, for the session log on /doing.
 * Note: `record` keeps only a single snapshot row, so this currently returns at
 * most one entry. Retaining history would mean dropping that delete-all step.
 */
export const recent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("t3PresenceEvents").order("desc").take(24);
  },
});

/**
 * Written by the Omarchy t3-project-sync bar widget via the /api/t3-presence
 * HTTP action. This table is a single-row snapshot of what Josh is working on
 * right now, not a history, so each write replaces every previous row.
 */
export const record = internalMutation({
  args: {
    status: v.union(v.literal("online"), v.literal("offline")),
    projectName: v.string(),
    threadId: v.string(),
    threadUpdatedAt: v.string(),
    machineId: v.string(),
    occurredAt: v.string(),
  },
  handler: async (ctx, args) => {
    const previous = await ctx.db.query("t3PresenceEvents").collect();
    for (const event of previous) {
      await ctx.db.delete(event._id);
    }
    return await ctx.db.insert("t3PresenceEvents", args);
  },
});
