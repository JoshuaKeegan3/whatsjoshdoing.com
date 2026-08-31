import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

/** Reads the markdown in `thinking/`, newest first. */
export function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), "thinking");
  if (!fs.existsSync(postsDir)) return [];

  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const { data } = matter(fs.readFileSync(path.join(postsDir, filename), "utf-8"));
      const date =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : data.date
            ? String(data.date).slice(0, 10)
            : "";

      return {
        slug,
        title: data.title ?? slug,
        date,
        description: data.description ?? "",
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** ISO date to the mono rail format used across the site. */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`)
    .toLocaleDateString("en-NZ", { year: "numeric", month: "short", day: "2-digit" })
    .replace(/\./g, "");
}
