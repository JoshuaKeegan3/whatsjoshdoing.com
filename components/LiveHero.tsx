"use client";

import { useQuery } from "convex/react";
import z from "zod";
import { api } from "../convex/_generated/api";

/** Shape of a row in the `t3PresenceEvents` table. */
const schema = z.object({
  projectName: z.string(),
  machineId: z.string(),
  // Anything the editor sends that we don't recognise is treated as offline.
  status: z.enum(["online", "offline"]).catch("offline"),
  occurredAt: z.string(),
});

/** A heartbeat older than this counts as offline whatever the row says. */
const STALE_AFTER_MS = 60 * 60 * 1000;

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
 * The site's headline is written by Josh's editor. zed-convex broadcasts the
 * open project, so the largest thing on the page is whatever he has open
 * right now. Offline, it falls back to the last thing he had open and when.
 *
 * Aliveness comes from the value changing, not from an animation looping:
 * the `key` replays the rise transition only when the project actually
 * differs.
 */
export default function LiveHero() {
  const res = useQuery(api.presence.latest);

  if (res === undefined) {
    return <div className="h-48" aria-hidden />;
  }

  const presence = res === null ? null : schema.parse(res);
  const project = presence?.projectName ?? "nothing yet";
  const occurredAt = presence ? new Date(presence.occurredAt).getTime() : 0;
  const now = Date.now();
  const online =
    presence?.status === "online" && now - occurredAt < STALE_AFTER_MS;

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
      </div>

      <div style={{ containerType: "inline-size" }}>
        <h1
          key={project}
          className={`rise mt-6 break-words leading-[0.95] tracking-tight ${
            online ? "text-signal" : "text-trace"
          }`}
          style={{ fontSize: heroFontSize(project) }}
        >
          {project}
        </h1>
      </div>

      <p className="mt-6 max-w-md text-xs leading-relaxed text-trace">
        {online
          ? "This updates in REAL TIME with what Josh is working on"
          : "The last project Josh had open. The readout is live whenever he is editing."}
      </p>
    </div>
  );
}
