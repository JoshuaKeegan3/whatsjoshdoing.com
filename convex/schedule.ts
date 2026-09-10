import { httpAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { readStrings } from "./validate";

/** The published schedule, or null before anything has been published. */
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("schedule").first();
  },
});

const scheduleEventShape = v.object({
  id: v.string(),
  title: v.string(),
  startsAt: v.string(),
  endsAt: v.string(),
});

/**
 * One row, replaced wholesale on every publish.
 *
 * A snapshot like `projectEvents`: the next publish supersedes it in full, and
 * a public deployment should not accumulate a record of where Josh has been.
 * The publisher already drops events that have ended, so this row only ever
 * holds what is current or upcoming.
 */
export const replace = internalMutation({
  args: {
    machineId: v.string(),
    timeZone: v.string(),
    publishedAt: v.string(),
    expiresAt: v.string(),
    events: v.array(scheduleEventShape),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("schedule").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("schedule", args);
  },
});

/**
 * Validates the untrusted `events` array. Each entry is narrowed to exactly
 * the four published fields, so anything extra a future publisher sends is
 * dropped here rather than stored and rendered.
 */
function readEvents(value: unknown) {
  if (!Array.isArray(value)) return null;
  const events: Record<"id" | "title" | "startsAt" | "endsAt", string>[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) return null;
    const fields = readStrings(entry as Record<string, unknown>, [
      "id",
      "title",
      "startsAt",
      "endsAt",
    ] as const);
    if (!fields) return null;
    events.push(fields);
  }
  return events;
}

/**
 * POST /api/schedule — records the calendar events Josh has chosen to publish.
 * Routed from http.ts; validation lives here so this module owns its shape.
 */
export const scheduleEvent = httpAction(async (ctx, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON request" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "body must be a JSON object" }, { status: 400 });
  }
  const payload = body as Record<string, unknown>;

  const fields = readStrings(payload, [
    "machineId",
    "timeZone",
    "publishedAt",
    "expiresAt",
  ] as const);
  if (!fields) {
    return Response.json({ error: "missing or invalid schedule fields" }, { status: 400 });
  }

  const events = readEvents(payload.events);
  if (!events) {
    return Response.json(
      { error: "events must be an array of {id, title, startsAt, endsAt}" },
      { status: 400 },
    );
  }

  const id = await ctx.runMutation(internal.schedule.replace, { ...fields, events });
  return Response.json({ ok: true, id });
});
