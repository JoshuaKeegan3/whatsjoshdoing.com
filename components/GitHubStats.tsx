"use client";

import { useState, useEffect } from "react";
import z from "zod";

const schema = z.object({
  /** null means the count could not be read, which is never shown as a number. */
  count: z.number().nullable(),
  date: z.string(),
});

async function fetchContributions(): Promise<number | null> {
  try {
    const response = await fetch("/api/github-contributions");
    if (!response.ok) return null;
    return schema.parse(await response.json()).count;
  } catch {
    return null;
  }
}

/** Today's GitHub contributions, the same figure as the profile graph. */
export default function GitHubStats() {
  const [count, setCount] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    fetchContributions().then(setCount);
  }, []);

  if (count === undefined) return <div className="h-16" aria-hidden />;

  return (
    <div>
      <p
        className={`text-[clamp(1.5rem,4vw,2.25rem)] leading-none tabular-nums ${
          count === null ? "text-trace" : ""
        }`}
      >
        {count ?? "–"}
      </p>
      <p className="label mt-2">
        {count === null ? "GitHub unreachable" : "Contributions today"}
      </p>
    </div>
  );
}
