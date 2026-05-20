"use client";

import React, { useState, useEffect, useRef } from "react";
import { Activity, Lightbulb, Briefcase } from "lucide-react";
import Link from "next/link";
import Arrow from "@/components/Arrow";

export default function Home() {
  const blurbRef = useRef<HTMLDivElement>(null);
  const [rollerLocation, setRollerLocation] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      if (active) {
        setRollerLocation((prev) => (prev + 1) % 3);
      }

      setActive((prev) => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, [active]);

  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (blurbRef.current) {
      blurbRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const revealTimer = setTimeout(() => setRevealed(true), 1500);
    return () => clearTimeout(revealTimer);
  }, []);

  return (
    <>
      <div
        className="center"
        style={{
          height: revealed ? "90vh" : "100vh",
          transition: "height 0.8s ease",
        }}
      >
        <div className="flex items-center justify-center">
          <h1 className="whitespace-nowrap">What&apos;s Josh Keegan</h1>
          <div
            className="roller pb-50"
            style={{
              maxWidth: revealed ? "20rem" : "0",
              opacity: revealed ? 1 : 0,
              paddingLeft: revealed ? "1rem" : "0",
              transition:
                "max-width 0.7s ease, opacity 0.7s ease, padding-left 0.7s ease",
            }}
          >
            <span
              id="rolltext"
              style={{
                animationPlayState: active ? "running" : "paused",
                textTransform: "uppercase",
              }} // On hover button collapse this span into another span with just the current
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
        <div
          className="flex pt-10 gap-4"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.7s ease 0.3s",
          }}
        >
          <div
            className={`p-4 rounded-lg flex justify-center items-center${rollerLocation === 1 ? " glowing-border text-white" : ""}`}
          >
            <Link href={"thinking?noanim=true"}>
              <Lightbulb size={48} />
            </Link>
          </div>
          <div
            className={`p-4 rounded-lg flex justify-center items-center${rollerLocation === 2 ? " glowing-border text-white" : ""}`}
          >
            <Link href={"done?noanim=true"}>
              <Briefcase size={48} />
            </Link>
          </div>
          <div
            className={`p-4 rounded-lg flex justify-center items-center${rollerLocation === 0 ? " glowing-border text-white" : ""}`}
          >
            <Link href={"doing?noanim=true"}>
              <Activity size={48} />
            </Link>
          </div>
        </div>
      </div>
      <div className="fade-in arrow-container">
        <Arrow handleClick={handleClick} />
      </div>
      <div
        ref={blurbRef}
        className="text-white h-dvh w-dvw align-baseline text-xl"
      >
        <h1 className="pt-10 text-center text-3xl">
          Josh Keegan is a Builder and a Fox
        </h1>
        <div className="px-40">
        <br/>
          AI has raised the skill floor, but it has also raised the ceiling. Anyone can write code now. What they can&apos;t do is build. The engineers who were always exceptional knew their tools deeply, understood how components fit together, and cared about the quality of what they shipped. They thought in systems. They suggested direction, made architectural decisions, and stayed curious. That thinking transfers, to data, to electronics, to the cloud.
                   <br />
                   <br />
                   AI moved the bottleneck from the fingers to the mind. The things that once made great engineers special now make them extraordinary.
          <br />
          <br />
          I resonated with the term fox while listening to a{" "}
          <Link
            className=" text-red-500"
            href="https://youtu.be/HUkBz-cdB-k?t=3258"
          >
            conversation
          </Link>{" "}
          between Terence &quot;The Mozart of Math&quot; Tao (widely considered
          to be one of the greatest mathematicians in history and smartest
          people alive) and MIT Artificial intelligence lecturer{" "}
          <Link className="text-red-500" href="https://lexfridman.com/">
            Lex Fridman.
          </Link>{" "}
          <br />
          <p className="py-2 px-40 italic">
            &quot;A fox knows many things across various fields and can spot
            analogies and adapt techniques from one area to solve problems in
            another.&quot;
          </p>
          We need Foxes as a driving force for progress and innovation. We used to do geometry with{' '}
          <Link
            className="text-red-500"
            href="https://www.youtube.com/watch?v=M-MgQC6z3VU"
          >
            Euclids ruler and compass.
          </Link>{" "}
          Descartes, connected geometry and number
          theory allowing the more intuative way of thinking about geometry that we teach today.
          While this is an Ancient example Tao also gives a personal
          anecdote of how he took the famous Game of Life and applied it to the
          famously complex Navier Stokes Equations in order to disprove a
          turbulent singularity.
          <br />
          <br />
          Software, makes logic tangible, directly converting thought into
          thing. The first time I created something was a game of Connect-Four
          and the feeling of my thought becoming reality was electric. I choose
          a career in tech because of this feeling. Because if someone has a
          problem, all I need do is think of the solution and it is theirs. This
          doesn&apos;t exist outside the of tech.
          <br />
          <br />

        </div>
      </div>
    </>
  );
}
