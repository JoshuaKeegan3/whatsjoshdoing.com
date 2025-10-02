"use client";

import React, { useState, useEffect } from "react";
import { Activity, Lightbulb, Briefcase } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const [rollerLocation, setRollerLocation] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      if (active) {
        setRollerLocation((prev) => (prev + 1) % 3);
        // console.log(rollerLocation);
      }

      setActive((prev) => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, [rollerLocation, active]);

  return (
    <div className="center flex-col">
      <div className="flex items-center justify-center">
        <h1 className="whitespace-nowrap">Whats Josh</h1>
        <div className="roller pb-50">
          <span
            id="rolltext"
            style={{
              animationPlayState: active ? "running" : "paused",
              textTransform: "uppercase",
            }}
          >
            Done
            <br />
            Doing
            <br />
            Thinking
            <br />
            Done
            <br />
            Doing
            <br />
            Thinking
          </span>
        </div>
      </div>
      <div className="flex pt-10 gap-4">
        <div
          className={clsx("p-4 rounded-lg flex justify-center items-center", {
            "glowing-border text-white": rollerLocation === 0,
          })}
        >
          <Lightbulb size={48} />
        </div>
        <div
          className={clsx("p-4 rounded-lg flex justify-center items-center", {
            "glowing-border text-white": rollerLocation === 1,
          })}
        >
          <Briefcase size={48} />
        </div>
        <div
          className={clsx("p-4 rounded-lg flex justify-center items-center", {
            "glowing-border text-white": rollerLocation === 2,
          })}
        >
          <Activity size={48} />
        </div>
      </div>
    </div>
  );
}
