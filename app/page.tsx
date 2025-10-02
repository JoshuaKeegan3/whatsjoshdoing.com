"use client";

import React, { useState, useEffect } from "react";
export default function Home() {
  const [rollerLocation, setRollerLocation] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setRollerLocation((prev) => Math.max(prev + 1, 0));
      setActive((prev) => !prev);
      console.log("test");
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="center flex-col">
      <div className="flex items-center justify-center">
        <h1 className="whitespace-nowrap">Whats Josh</h1>
        <div className="roller">
          <span
            id="rolltext"
            style={{ animationPlayState: active ? "running" : "paused" }}
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
      <div className="flex-col">Test</div>
    </div>
  );
}
