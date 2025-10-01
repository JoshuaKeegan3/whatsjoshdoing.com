"use client";

import { useQuery } from "convex/react";
import ImportantText from "@/components/ImportantText";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import z from "zod";

type Activity = {
  _id: string;
  project_name: string;
  file_name: string;
  class_name: string;
  function_name: string;
  repo_name: string;
  _creationTime: number;
};

type Status = "Offline" | "Online";

const INACTIVE_OPTIONS = [
  "Definitely Vibing",
  "Probably Rock Hugging",
  "Dreaming of Code",
  "Wishing you a good day",
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
  let project_name = activities.project_name;
  let file_name = activities.file_name;
  let class_name = activities.class_name;
  let function_name = activities.function_name;
  let creation_time = activities._creationTime;
  let now = new Date().getTime();

  // if the time difference is greater than 60 minutes
  // set offline to true
  let status: Status = 60 * 60 > now - creation_time ? "Online" : "Offline";

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
          <ImportantText zoom={false} text={project_name} />
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
        <p className="fade-in text-3xl flex flex-row p-4 rounded-lg">
          Click
          <Link href="whatsHeDone">
            <ImportantText
              text="Here"
              animate_text={true}
              zoom={false}
            ></ImportantText>{" "}
          </Link>
          to check out what he has done
        </p>
      )}
    </div>
  );
}
