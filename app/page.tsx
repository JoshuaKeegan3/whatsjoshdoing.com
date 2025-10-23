"use client";

import React, { useState, useEffect, useRef } from "react";
import { Activity, Lightbulb, Briefcase } from "lucide-react";
import clsx from "clsx";
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

  const handleClick = () => {
    if (blurbRef.current) {
      blurbRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="center">
        <div className="flex items-center justify-center">
          <h1 className="whitespace-nowrap">What&apos;s Josh Keegan</h1>
          <div className="roller pb-50 fade-in">
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
        <div className="flex pt-10 gap-4 fade-in">
          <div
            className={clsx("p-4 rounded-lg flex justify-center items-center", {
              "glowing-border text-white": rollerLocation === 1,
            })}
          >
            <Link href={"thinking?noanim=true"}>
              <Lightbulb size={48} />
            </Link>
          </div>
          <div
            className={clsx("p-4 rounded-lg flex justify-center items-center", {
              "glowing-border text-white": rollerLocation === 2,
            })}
          >
            <Link href={"done?noanim=true"}>
              <Briefcase size={48} />
            </Link>
          </div>
          <div
            className={clsx("p-4 rounded-lg flex justify-center items-center", {
              "glowing-border text-white": rollerLocation === 0,
            })}
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
          Josh Keegan is a Software Fox
        </h1>
        <div className="px-40">
          <br />I resonated with this term while listening to a{" "}
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
          Terence Tao outlines the need for foxes, not simply as a swiss army
          knife, but as a driving force for progress and innovation. He cites
          Descartes, explaining how he discovered that geometry and number
          theory can be unified by parameterising a geometric plane with two
          real numbers. It is because of Descartes that we teach geometry with
          numbers and not{" "}
          <Link
            className="text-red-500"
            href="https://www.youtube.com/watch?v=M-MgQC6z3VU"
          >
            Euclids ruler and compass.
          </Link>{" "}
          While this is an Ancient example Terence Tao also gives a personal
          anecdote of how he took the famous Game of Life and applied it to the
          famously complex Navier Stokes Equations in order to disprove a
          turbulent singularity.
          <br />
          <br />
          This is a conclusion I came to personally. I had a teacher that told
          us that Math is Applied Logic, Physics is applied Math. Chemistry is
          just applied Physics. Biology is just applied Chemistry. As you can
          imagine, this process can go on, however it is tedious. Software, I
          reasoned, makes logic tangible, directly converting thought into
          thing. The first time I created something was a game of Connect-Four
          and the feeling of my thought becoming reality was electric. I choose
          a career in tech because of this feeling. Because if someone has a
          problem, all I need do is think of the solution and it is theirs. This
          doesn&apos;t exist outside the of tech. I choose to be a Software Fox
          because to help, whoever, wherever, forever.
          <br />
          <br />
          Somethings I&apos;ve worked on include:
          <ul className="list-disc pl-12">
            <li>
              Physics, Chemistry and Math Simulations, Safety-Critical Systems,
              AI, Data, Dashboards, and Games
            </li>
            <li>
              Applications for Mobile, using React-Native, Flutter, Tauri and
              Svelte
            </li>
            <li>Both TUI and Desktop using the likes of QT or GPUI</li>
            <li>Web Apps using React, Next, Solid, HTML and Vue</li>
            <li>Games using Unreal, Godot, Unity and parser for the web</li>
            <li>Programming contests, written documentation and tests</li>
            <li>
              Contributed to open source, worked with government and helped
              small businesses
            </li>
            <li>
              Kept up to date with potential future technologies for example
              Mojo and Mamba in AI
            </li>
            <li>
              Enhanced my development workflow by choosing tools I believe in
              and occasionally creating my own
            </li>
            <li>Discussed start-up ideas with investors</li>
          </ul>
          <br />
          And of course this means that my learning is not over. I am working
          towards an Azure AI Engineer Associate qualification and have started
          creating my own homelab to practice with VMs. I&apos;m currently
          looking for full-time work with other people with a similar passion
          for tech.
        </div>
      </div>
    </>
  );
}
