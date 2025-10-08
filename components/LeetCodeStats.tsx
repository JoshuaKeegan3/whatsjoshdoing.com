import { useState, useEffect } from "react";
import "./LeetCodeStats.css";

type LeetCodeCalendar = {
  [key: string]: number;
};

type LeetCodeResponse = {
  submissionCalendar: string;
};

async function fetchLeetCodeCalendar(
  username: string,
): Promise<LeetCodeResponse | undefined> {
  const apiUrl = `https://alfa-leetcode-api.onrender.com/${username}/calendar`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch LeetCode calendar:", error);
  }
}

export default function LeetCodeStats() {
  const [submissionData, setSubmissionData] = useState<LeetCodeCalendar | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const leetcodeUsername = "JoshuaKeegan3";

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchLeetCodeCalendar(leetcodeUsername);
      if (res && res.submissionCalendar) {
        setSubmissionData(JSON.parse(res.submissionCalendar));
      }
      setLoading(false);
    };

    fetchData();
  }, [leetcodeUsername]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!submissionData) {
    return <div>Error fetching data.</div>;
  }

  const date = new Date();
  const utc_date_seconds: number = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000,
  );

  const SECONDS_IN_DAY = 24 * 60 * 60;

  const cells = [];
  for (let i = 0; i < 30; i++) {
    const current_date = utc_date_seconds - SECONDS_IN_DAY * i;

    const submission_count = submissionData[current_date] || 0;

    let color_class = "heatmap-cell-0";
    if (submission_count > 0 && submission_count <= 1) {
      color_class = "heatmap-cell-1";
    } else if (submission_count > 1 && submission_count <= 2) {
      color_class = "heatmap-cell-2";
    } else if (submission_count > 2 && submission_count <= 3) {
      color_class = "heatmap-cell-3";
    } else if (submission_count > 3) {
      color_class = "heatmap-cell-4";
    }

    cells.push(<div key={i} className={`heatmap-cell ${color_class}`}></div>);
  }

  return <div className="heatmap">{cells}</div>;
}
