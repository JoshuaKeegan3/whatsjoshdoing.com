"use client";

import ImportantText from "@/components/ImportantText";
import WhatsHeDoing from "@/components/WhatsHeDoing";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Suspense } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function DoingContent() {
  const searchParams = useSearchParams();
  const noanim = searchParams.get("noanim") === "true";

  return (
    <div className="h-screen flex justify-center pt-64">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex aspect-square h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-600">
            ?
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 text-sm">
          This is a live updating page which shows what Josh is programming currently. It uses a modified version of the Zed code editor in order to sync the project name and file with this page. When he changes file, you see it live. Right here.
        </HoverCardContent>
      </HoverCard>
      <div className="flex flex-col items-center">
        <div className="leading-normal text-3xl flex flex-row p-4 rounded-lg">
          <p className={clsx({ "fade-in": !noanim })}>What is</p>
          <ImportantText zoom={true} text="Josh Keegan" noanim={noanim} />
          <p className={clsx({ "fade-in": !noanim })}>up to?</p>
        </div>
        <WhatsHeDoing noanim={noanim} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <DoingContent />
    </Suspense>
  );
}
