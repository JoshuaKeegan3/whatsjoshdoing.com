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
      console.log("Browser datetime:", now.toString());

      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth();
      const todayDate = now.getDate();

      const pushEvents = events.filter((e) => e.type === "PushEvent");
      console.log(
        "Fetched PushEvent datetimes:",
        pushEvents.map((e) => ({
          raw: e.created_at,
          local: new Date(e.created_at).toString(),
          size: e.payload.size,
          commits: e.payload.commits?.length,
        })),
      );

      const count = pushEvents
        .filter((e) => {
          const d = new Date(e.created_at);
          return (
            d.getFullYear() === todayYear &&
            d.getMonth() === todayMonth &&
            d.getDate() === todayDate
          );
        }).length;

      console.log(count);
      setCommitsToday(count);
    };

    fetchData();
  }, []);

  return (
    <div className="kpi">
      <span className="kpi-value">
        {commitsToday === null ? "—" : commitsToday}
      </span>
      <span className="kpi-sublabel">commits today</span>
    </div>
  );
}
