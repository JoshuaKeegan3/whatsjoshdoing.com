"use client";

import { useQuery } from "convex/react";
import ImportantText from "@/components/ImportantText";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import z from "zod";
import clsx from "clsx";

type Status = "Offline" | "Online";

const INACTIVE_OPTIONS = [
  "Inactive, but definitely Vibing",
  "Inactive, but probably Rock Hugging",
  "Inactive, but dreaming of Code",
  "Inactive, but wishing you a good day",
  "Power Systems Study",
  "Masters of Engergy Study"
];

/** Shape of a row in the `t3PresenceEvents` table. */
const schema = z.object({
  projectName: z.string(),
  machineId: z.string(),
  // Anything the editor sends that we don't recognise is treated as offline.
  status: z.enum(["online", "offline"]).catch("offline"),
  occurredAt: z.string(),
});

export default function WhatsHeDoing({ noanim }: { noanim?: boolean }) {
  const res = useQuery(api.presence.latest);
  if (res === undefined) {
    return null;
  }

  const presence = res === null ? null : schema.parse(res);
  const occurred_at = presence ? new Date(presence.occurredAt).getTime() : 0;
  const now = new Date().getTime();

  // A heartbeat older than 60 minutes counts as offline regardless of status.
  const status: Status =
    presence?.status === "online" && now - occurred_at < 60 * 60 * 1000
      ? "Online"
      : "Offline";

  let status_marker = undefined;
  let status_text = undefined;
  if (status == "Online" && presence) {
    status_marker = (
      <div className="text-3xl flex flex-row p-4 rounded-lg">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
        </span>
      </div>
    );

    status_text = (
      <div className="flex flex-col">
        <div className="justify-center flex flex-row">
          {"Currently working on"}
          <ImportantText zoom={false} text={presence.projectName} />
        </div>

        <div className="justify-center flex flex-row">
          {"from"}
          <ImportantText zoom={false} text={presence.machineId} />
        </div>
      </div>
    );
  } else {
    status_marker = (
      <div className="text-3xl flex flex-row p-4 rounded-lg">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-700 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-red-700"></span>
        </span>
      </div>
    );
    status_text = (
      <>
        <div className="text-3xl flex flex-row p-4 rounded-lg">
          {
            INACTIVE_OPTIONS[
              Math.floor(INACTIVE_OPTIONS.length * Math.random())
            ]
          }
        </div>
      </>
    );
  }

  return (
    <div>
      <div
        className={clsx(
          "leading-normal text-3xl flex flex-row p-4 rounded-lg",
          { "fade-in": !noanim },
        )}
      >
        {status_text}
        {status_marker}
      </div>
      {status == "Offline" && (
        <div
          className={clsx("text-3xl flex flex-row p-4 rounded-lg", {
            "fade-in": !noanim,
          })}
        >
          Click
          <Link href="done">
            <ImportantText
              text="Here"
              animate_text={true}
              zoom={false}
              noanim={noanim}
            ></ImportantText>{" "}
          </Link>
          to check out what he has done
        </div>
      )}
    </div>
  );
}
