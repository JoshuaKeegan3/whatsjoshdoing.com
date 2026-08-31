import type { Metadata } from "next";
import Link from "next/link";
import { sites, type Site } from "@/lib/recommending";

export const metadata: Metadata = {
  title: "Recommending · Josh Keegan",
  description: "Sites worth bookmarking, grouped by subject.",
};

/** Categories keep the order they first appear in the source list. */
function groupByCategory(items: Site[]) {
  const groups = new Map<string, Site[]>();
  for (const site of items) {
    const existing = groups.get(site.category);
    if (existing) existing.push(site);
    else groups.set(site.category, [site]);
  }
  return [...groups];
}

const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export default function RecommendingPage() {
  const groups = groupByCategory(sites);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-16 md:px-12 md:pt-24">
      <h1 className="rise text-[clamp(1.75rem,5vw,2.75rem)] leading-none tracking-tight">
        Recommending
      </h1>
      <p className="prose-body mt-4 text-trace">
        Things Josh thinks are worth your time.
      </p>

      {groups.map(([category, items]) => (
        <section key={category} className="pt-14">
          <h2 className="label mb-4">
            {category} <span className="text-rule">/</span> {items.length}
          </h2>

          {items.map((site) => (
            <Link
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="row block py-5"
            >
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-[0.9375rem]">{site.title}</h3>
                <span className="shrink-0 text-xs text-trace">{domainOf(site.url)}</span>
              </div>
              <p className="prose-body mt-1 text-trace">{site.description}</p>
            </Link>
          ))}
        </section>
      ))}
    </div>
  );
}
