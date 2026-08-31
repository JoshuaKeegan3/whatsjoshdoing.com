"use client";

import { useQuery } from "convex/react";
import z from "zod";
import { api } from "../convex/_generated/api";

const schema = z.array(
  z.object({
    _id: z.string(),
    projectName: z.string(),
    machineId: z.string(),
    status: z.enum(["online", "offline"]).catch("offline"),
    occurredAt: z.string(),
  }),
);

const stamp = (iso: string) =>
  new Date(iso).toLocaleString("en-NZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

/**
 * The heartbeats behind the readout above. Every row was written by
 * zed-convex when Josh opened or closed a project, so this is the raw feed
 * rather than a summary of it.
 */
export default function SessionLog() {
  const res = useQuery(api.presence.recent);
  if (res === undefined || res === null) return null;

  const events = schema.parse(res);
  if (events.length === 0) return null;

  return (
    <section className="pt-20">
      <h2 className="label mb-4">Session log</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-md text-left text-xs">
          <thead>
            <tr className="label">
              <th className="py-2 font-normal">Time</th>
              <th className="py-2 font-normal">Project</th>
              <th className="py-2 font-normal">Machine</th>
              <th className="py-2 text-right font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="row">
                <td className="whitespace-nowrap py-2.5 pr-6 text-trace tabular-nums">
                  {stamp(event.occurredAt)}
                </td>
                <td className="py-2.5 pr-6">{event.projectName}</td>
                <td className="py-2.5 pr-6 text-trace">{event.machineId}</td>
                <td className="py-2.5 text-right">
                  <span className={event.status === "online" ? "text-live" : "text-trace"}>
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
