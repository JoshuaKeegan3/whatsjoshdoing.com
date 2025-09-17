"use client";

import ImportantText from "@/components/ImportantText";
// "use client";

// import Image from "next/image";
// import { useQuery } from "convex/react";
// import { api } from "../convex/_generated/api";

// export default function Home() {
//   const tasks = useQuery(api.tasks.get);
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
//     </main>
//   );
// }

export default function WhatsHeDoing() {
  return (
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
  );
}
