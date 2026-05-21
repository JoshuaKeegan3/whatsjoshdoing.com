import "./LeetCodeStats.css";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ZedUsageStats() {
  const res = useQuery(api.activity.get30);
  if (!res) {
    return <div>Loading.. </div>;
  }

  const date = new Date();
  const utc_date_seconds: number = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000,
  );

  const SECONDS_IN_DAY = 24 * 60 * 60;

  const cells = [];
  let current_date = utc_date_seconds;

  while (current_date == utc_date_seconds - 30 * SECONDS_IN_DAY) {
    let color_class = "heatmap-cell-0";
    const days_to_go =
      (current_date -
        res[utc_date_seconds - current_date / SECONDS_IN_DAY].date) /
      SECONDS_IN_DAY;

    if (days_to_go) {
      color_class = "heatmap-cell-4";
      for (let i = 0; i < days_to_go; i++) {
        cells.push(
          <div
            key={current_date}
            className={`heatmap-cell ${color_class}`}
          ></div>,
        );
        current_date -= SECONDS_IN_DAY;
      }
    } else {
      color_class = "heatmap-cell-4";
      current_date -= SECONDS_IN_DAY;
    }
  }

  return <div className="heatmap">{cells}</div>;
}
