import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Thinking · Josh Keegan",
  description: "Essays.",
};

export default function ThinkingPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-16 md:px-12 md:pt-24">
      <h1 className="rise text-[clamp(1.75rem,5vw,2.75rem)] leading-none tracking-tight">
        Thinking
      </h1>
      <div className="mt-14">
        {posts.length === 0 ? (
          <p className="prose-body text-trace">Nothing published yet.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/thinking/${post.slug}`}
              className="row grid grid-cols-1 gap-x-8 gap-y-1 py-5 md:grid-cols-[7rem_1fr]"
            >
              <time className="text-xs text-trace" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
              <div>
                <h2 className="text-[0.9375rem] text-signal">{post.title}</h2>
                {post.description && (
                  <p className="prose-body mt-1 text-trace">{post.description}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
