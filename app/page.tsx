"use client";

import { useEffect, useState } from "react";
import ImportantText from "@/components/ImportantText";
import WhatsHeDoing from "@/components/WhatsHeDoing";
import Arrow from "@/components/Arrow";

export default function Home() {
  const [playAnimation, setPlayAnimation] = useState(false);

  useEffect(() => {
    setPlayAnimation(true);
  }, []);

  return (
    <div className="h-screen flex justify-center pt-64">
      <div className="flex flex-col items-center">
        <div className="leading-normal text-3xl flex flex-row p-4 rounded-lg">
          <p className="fade-in">What is</p>
          <ImportantText zoom={true} text="Josh Keegan" />
          <p className="fade-in">up to?</p>
        </div>
        <WhatsHeDoing />
      </div>
      <div className={`arrow-container ${playAnimation ? "animate-hud" : ""}`}>
        <a href="/whatsHeDone">
          <Arrow />
        </a>
      </div>
      {playAnimation && <div className="pulse"></div>}
    </div>
  );
}
