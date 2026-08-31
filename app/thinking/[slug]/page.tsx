import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Components } from "react-markdown";
import { formatDate } from "@/lib/posts";

const postsDir = path.join(process.cwd(), "thinking");

export function generateStaticParams() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

const linkClass =
  "underline decoration-rule underline-offset-4 transition-colors hover:text-live hover:decoration-live";

/** Prose is the serif voice. Headings and code stay mono: those are structure. */
const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-12 font-mono text-xl tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-10 font-mono text-base tracking-tight">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mb-2 mt-8 label">{children}</h3>,
  p: ({ children }) => <p className="mb-5">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-5 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-5 list-decimal space-y-1 pl-5">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l border-rule py-1 pl-6 italic text-trace">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) =>
    className?.includes("language-") ? (
      <code className="mb-5 block overflow-x-auto border border-rule p-4 font-mono text-xs leading-relaxed">
        {children}
      </code>
    ) : (
      <code className="font-mono text-[0.8em]">{children}</code>
    ),
  hr: () => <hr className="my-10 border-t border-rule" />,
};

/** Reads frontmatter so a shared post link carries its own title. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return {};

  const { data } = matter(fs.readFileSync(filePath, "utf-8"));
  return {
    title: `${data.title ?? slug} · Josh Keegan`,
    description: data.description ?? undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();

  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : data.date
        ? String(data.date).slice(0, 10)
        : "";

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-16 md:px-12 md:pt-24">
      <Link href="/thinking" className="label transition-colors hover:text-signal">
        ← Thinking
      </Link>

      <article className="mt-12">
        <header className="border-b border-rule pb-8">
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] leading-tight tracking-tight">
            {data.title ?? slug}
          </h1>
          {date && (
            <time className="mt-3 block text-xs text-trace" dateTime={date}>
              {formatDate(date)}
            </time>
          )}
        </header>

        <div className="prose-body mt-10">
          <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
