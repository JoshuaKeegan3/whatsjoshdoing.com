"use client";
import ImportantText from "@/components/important_text";

export default function Home() {
  return (
    <div className="h-screen flex justify-center pt-64">
      <div className="flex flex-col items-center">
        <div className="leading-normal text-3xl flex flex-row p-4 rounded-lg">
          <p className="fade-in">What is</p>
          <ImportantText zoom={true} text="Josh Keegan" />
          <p className="fade-in">up to?</p>
        </div>

        <div className="fade-in leading-normal text-3xl flex flex-row p-4 rounded-lg">
          {"Currently modifying"}
          <ImportantText zoom={false} text="page.tsx" />
          {"in"}
          <ImportantText zoom={false} text="whatsjoshdoing.com" />
          <div className="text-3xl flex flex-row p-4 rounded-lg">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>{" "}
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
