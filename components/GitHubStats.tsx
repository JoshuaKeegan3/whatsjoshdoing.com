"use client";

import { useState, useEffect } from "react";

type GitHubEvent = {
  type: string;
  created_at: string;
  payload: {
    size?: number;
    commits?: Array<{ sha: string }>;
  };
};

async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  try {
    const response = await fetch("/api/github-events");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch GitHub activity:", error);
    return [];
  }
}

export default function GitHubStats() {
  const [commitsToday, setCommitsToday] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const events = await fetchGitHubEvents();
      const now = new Date();

      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth();
      const todayDate = now.getDate();

      const pushEvents = events.filter((e) => e.type === "PushEvent");

      const count = pushEvents
        .filter((e) => {
          const d = new Date(e.created_at);
          return (
            d.getFullYear() === todayYear &&
            d.getMonth() === todayMonth &&
            d.getDate() === todayDate
          );
        }).length;

      setCommitsToday(count);
    };

    fetchData();
  }, []);

  return (
    <div>
      <p className="text-[clamp(1.5rem,4vw,2.25rem)] leading-none tabular-nums">
        {commitsToday ?? "\u2013"}
      </p>
      <p className="label mt-2">Commits today</p>
    </div>
  );
}
