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

export default function WhatsHeDoing() {
  const activities: any = useQuery(api.activity.get);
  if (activities == undefined) {
    return;
  }
  let id = activities[0]._id;
  let project_name = activities[0].project_name;
  let file_name = activities[0].file_name;
  let class_name = activities[0].class_name;
  let function_name = activities[0].function_name;

  let creation_time = activities[0]._creationTime;
  let now = new Date();

  let status: Status = "Online";
  // if the time difference is greater than 30 minutes
  // set offline to true

  let output_text = (
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

  let status_block = undefined;

  if (status == "Online") {
    status_block = (
      <div className="text-3xl flex flex-row p-4 rounded-lg">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>{" "}
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
        </span>
      </div>
    );
  } else {
    status_block = (
      <div className="text-3xl flex flex-row p-4 rounded-lg">
        <span className="relative flex size-3">
          <span className="relative inline-flex size-3 rounded-full bg-red-700"></span>
        </span>
      </div>
    );
  }

  return (
    <div className="fade-in leading-normal text-3xl flex flex-row p-4 rounded-lg">
      {output_text}
      {status_block}
    </div>
  );
}
