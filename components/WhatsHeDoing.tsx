"use client";

import { useQuery } from "convex/react";
import ImportantText from "@/components/ImportantText";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import z from "zod";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type Status = "Offline" | "Online";

const INACTIVE_OPTIONS = [
  "Inactive, but definitely Vibing",
  "Inactive, but probably Rock Hugging",
  "Inactive, but dreaming of Code",
  "Inactive, but wishing you a good day",
];

const schema = z.object({
  project_name: z.string(),
  file_name: z.string(),
  class_name: z.string(),
  function_name: z.string(),
  repo_name: z.string(),
  // readme: z.string(),
  _creationTime: z.number(),
});

export default function WhatsHeDoing() {
  const res = useQuery(api.activity.get);
  if (res == undefined) {
    return;
  }

  const activities = schema.parse(res[0]);
  const project_name = activities.project_name;
  const file_name = activities.file_name;

  const function_name = activities.function_name;
  const creation_time = activities._creationTime;
  const now = new Date().getTime();

  // if the time difference is greater than 60 minutes
  // set offline to true
  let status: Status = 60 * 60 > now - creation_time ? "Online" : "Offline";
  status = 60 * 60 < now - creation_time ? "Online" : "Offline";

  let status_marker = undefined;
  let status_text = undefined;
  if (status == "Online") {
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
          <HoverCard>
            <HoverCardTrigger>
              <ImportantText zoom={false} text={project_name} />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/vercel.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm">
                    The React Framework – created and maintained by @vercel.
                  </p>
                  <div className="text-muted-foreground text-xs">
                    Joined December 2021
                  </div>{" "}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="justify-center flex flex-row">
          {"Modifying"}
          <ImportantText zoom={false} text={function_name} />
          {"in"}
          <ImportantText zoom={false} text={file_name} />
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
      <div className="fade-in leading-normal text-3xl flex flex-row p-4 rounded-lg">
        {status_text}
        {status_marker}
      </div>
      {status == "Offline" && (
        <div className="fade-in text-3xl flex flex-row p-4 rounded-lg">
          Click
          <Link href="whatsHeDone">
            <ImportantText
              text="Here"
              animate_text={true}
              zoom={false}
            ></ImportantText>{" "}
          </Link>
          to check out what he has done
        </div>
      )}
    </div>
  );
}
