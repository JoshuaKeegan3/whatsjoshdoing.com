"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import z from "zod";
import { api } from "../convex/_generated/api";

/** Shape of the single row in the `projectEvents` table. */
const schema = z.object({
  projectName: z.string(),
  // The file open in Zed. Empty for the other sources, and for rows written
  // before file tracking existed.
  fileName: z.string().catch(""),
  machineId: z.string(),
  // Anything the editor sends that we don't recognise is treated as offline.
  status: z.enum(["online", "offline"]).catch("offline"),
  occurredAt: z.string(),
});

/** Intl throws on a zone it does not know, which would take the hero down. */
const isTimeZone = (zone: string) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
};

/** Shape of the single row in the `schedule` table. */
const scheduleSchema = z.object({
  timeZone: z.string().refine(isTimeZone),
  expiresAt: z.string(),
  events: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      startsAt: z.string(),
      endsAt: z.string(),
    }),
  ),
});

type Schedule = z.infer<typeof scheduleSchema>;

/** A heartbeat older than this counts as offline whatever the row says. */
const STALE_AFTER_MS = 60 * 60 * 1000;

/** Longest a single timer runs, so a suspended laptop cannot sit on a stale one. */
const MAX_TIMER_MS = 15 * 60 * 1000;

/**
 * The hero is a repo name, so its length is not ours to choose. Martian Mono
 * advances 0.68em per character, which makes the size that fits exactly
 * `container / (chars * 0.68)`. Container query units do that arithmetic at
 * every viewport, so a long identifier shrinks instead of breaking mid-word.
 */
const ADVANCE_PER_EM = 0.68;

const heroFontSize = (name: string) =>
  `clamp(1.5rem, calc(100cqw / ${(name.length * ADVANCE_PER_EM).toFixed(2)}), 6.5rem)`;

function ago(from: number, to: number): string {
  const minutes = Math.round((to - from) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * The event running right now, or null. A schedule past its expiry is ignored
 * entirely: the publisher only runs while the laptop is awake, so a stale list
 * cannot be trusted to still be true, and claiming Josh is at a cancelled
 * event is the one failure worth designing against.
 */
function runningEvent(schedule: Schedule | null, now: number) {
  if (!schedule || Date.parse(schedule.expiresAt) <= now) return null;
  return (
    schedule.events.find(
      (event) =>
        Date.parse(event.startsAt) <= now && now < Date.parse(event.endsAt),
    ) ?? null
  );
}

/** The next moment the readout could change: a start, an end, or the expiry. */
function nextBoundary(schedule: Schedule | null, now: number) {
  if (!schedule) return null;
  const times = [
    ...schedule.events.flatMap((event) => [
      Date.parse(event.startsAt),
      Date.parse(event.endsAt),
    ]),
    Date.parse(schedule.expiresAt),
  ].filter((time) => time > now);
  return times.length > 0 ? Math.min(...times) : null;
}

/**
 * Re-renders at the next schedule boundary rather than on an interval, so
 * nothing repaints between events. `tick` is a dependency so the timer re-arms
 * itself after firing.
 */
function useBoundary(at: number | null) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (at === null) return;
    const delay = Math.min(Math.max(at - Date.now(), 1000), MAX_TIMER_MS);
    const timer = setTimeout(() => setTick((n) => n + 1), delay);
    return () => clearTimeout(timer);
  }, [at, tick]);
}

const untilLabel = (endsAt: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(endsAt));

/**
 * The site's headline is whatever Josh is doing right now. A publishable
 * calendar event takes it while the event runs; otherwise it is the project
 * project-sync reports, with the open file named under it. Offline, it falls
 * back to the last thing he had open and when.
 *
 * Aliveness comes from the value changing, not from an animation looping:
 * the `key` replays the rise transition only when the headline actually
 * differs.
 */
export default function LiveHero() {
  const res = useQuery(api.project.latest);
  const scheduleRow = useQuery(api.schedule.current);

  const now = Date.now();
  // An unloaded schedule is treated as "no event" rather than as a loading
  // state, so a slow second query cannot blank a hero the first one can
  // already fill. safeParse, so a malformed row degrades the same way instead
  // of taking the hero down with it.
  const schedule =
    scheduleRow == null ? null : (scheduleSchema.safeParse(scheduleRow).data ?? null);
  const event = runningEvent(schedule, now);
  useBoundary(nextBoundary(schedule, now));

  if (res === undefined) {
    return <div className="h-48" aria-hidden />;
  }

  const presence = res === null ? null : schema.parse(res);
  const project = presence?.projectName ?? "nothing yet";
  const occurredAt = presence ? new Date(presence.occurredAt).getTime() : 0;
  const online =
    presence?.status === "online" && now - occurredAt < STALE_AFTER_MS;

  // Being somewhere outranks having a repo open, so a running event takes the
  // headline for its duration and the project returns when it ends.
  const headline = event ? event.title : project;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem]">
        <span
          className={`size-1.5 ${online ? "bg-live" : "bg-trace"}`}
          aria-hidden
        />
        <span
          className={`uppercase tracking-[0.18em] ${online ? "text-live" : "text-trace"}`}
        >
          {online ? "Online" : "Offline"}
        </span>
        {presence && (
          // The machine id is an identifier, so it keeps the casing the editor sent.
          <span className="text-trace">
            {presence.machineId}
            {!online && ` · last seen ${ago(occurredAt, now)}`}
          </span>
        )}
        {event && schedule && (
          <span className="text-live">
            At an event · until {untilLabel(event.endsAt, schedule.timeZone)}
          </span>
        )}
      </div>

      <div style={{ containerType: "inline-size" }}>
        <h1
          key={headline}
          className={`rise mt-6 break-words leading-[0.95] tracking-tight ${
            online || event ? "text-signal" : "text-trace"
          }`}
          style={{ fontSize: heroFontSize(headline) }}
        >
          {headline}
        </h1>
      </div>

      {!event && presence?.fileName && (
        <p className="mt-3 break-all text-xs text-trace">{presence.fileName}</p>
      )}

      <p className="mt-6 max-w-md text-xs leading-relaxed text-trace">
        {event
          ? "Josh is at this right now. The readout returns to whatever he has open when it ends."
          : online
            ? "This updates in REAL TIME with what Josh is working on"
            : "The last project Josh had open. The readout is live whenever he is editing."}
      </p>
    </div>
  );
}
