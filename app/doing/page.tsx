"use client";

import ImportantText from "@/components/ImportantText";
import WhatsHeDoing from "@/components/WhatsHeDoing";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function Home() {
  const searchParams = useSearchParams();
  const noanim = searchParams.get("noanim") === "true";
  return (
    <div className="h-screen flex justify-center pt-64">
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
