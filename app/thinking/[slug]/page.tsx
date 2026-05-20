import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Components } from "react-markdown";

const postsDir = path.join(process.cwd(), "thinking");

export function generateStaticParams() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-10 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-base leading-7 mb-4 text-foreground/90">{children}</p>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-red-500 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-foreground/90">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground/90">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-red-500 pl-4 italic text-muted-foreground my-4">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <code
        className="block bg-muted rounded-lg p-4 text-sm overflow-x-auto mb-4"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {children}
      </code>
    ) : (
      <code
        className="bg-muted rounded px-1.5 py-0.5 text-sm"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {children}
      </code>
    );
  },
  hr: () => <hr className="border-t border-border my-8" />,
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const title = data.title ?? slug;
  const date = data.date instanceof Date
    ? data.date.toISOString().slice(0, 10)
    : data.date ? String(data.date).slice(0, 10) : "";

  return (
    <main className="min-h-screen px-10 py-20 max-w-3xl mx-auto">
      <Link
        href="/thinking"
        className="text-sm text-muted-foreground hover:text-red-500 transition-colors mb-12 inline-block"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        ← What&apos;s He Thinking
      </Link>

      <article>
        <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
