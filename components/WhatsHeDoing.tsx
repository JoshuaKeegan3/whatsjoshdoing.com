"use client";

import { useQuery } from "convex/react";
import ImportantText from "@/components/ImportantText";
import { api } from "../convex/_generated/api";

type Activity = {
  _id: string;
  project_name: string;
  file_name: string;
  class_name: string;
  function_name: string;
  _creationTime: string;
};

type Status = "Offline" | "Online";

const INACTIVE_OPTIONS = [
  "Definitely Vibing",
  "Probably Rock Hugging",
  "Dreaming of Code",
  "Wishing you a good day",
];

export default function WhatsHeDoing() {
  const activities: any = useQuery(api.activity.get);
  if (activities == undefined) {
    return;
  }
  let project_name = activities[0].project_name;
  let file_name = activities[0].file_name;
  let class_name = activities[0].class_name;
  let function_name = activities[0].function_name;
  // let repo = activities[0].repo;
  // let readme = activities[0].readme;

  let creation_time = activities[0]._creationTime;
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
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>{" "}
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
      <p className="text-3xl flex flex-row p-4 rounded-lg">
        {INACTIVE_OPTIONS[Math.floor(INACTIVE_OPTIONS.length * Math.random())]}
      </p>
    );
  }

  return (
    <div className="fade-in leading-normal text-3xl flex flex-row p-4 rounded-lg">
      {status_text}
      {status_marker}
    </div>
  );
}
