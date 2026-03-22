import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Link from "next/link";

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

function getPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), "thinking");
  if (!fs.existsSync(postsDir)) return [];

  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : data.date ? String(data.date).slice(0, 10) : "",
        description: data.description ?? "",
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ThinkingPage() {
  const posts = getPosts();

  return (
    <main className="min-h-screen px-10 py-20 max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold tracking-widest uppercase mb-16">
        What&apos;s He Thinking
      </h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/thinking/${post.slug}`} className="group glass-card block p-6">
                <p
                  className="text-xs text-muted-foreground mb-2"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {formatDate(post.date)}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h2>
                  <span className="text-muted-foreground shrink-0 group-hover:text-red-500 transition-colors">→</span>
                </div>
                {post.description && (
                  <p className="text-sm text-muted-foreground mt-2">{post.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
