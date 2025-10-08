"use client";

import ImportantText from "@/components/ImportantText";
import WhatsHeDoing from "@/components/WhatsHeDoing";

export default function Home() {
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
    </div>
  );
}
