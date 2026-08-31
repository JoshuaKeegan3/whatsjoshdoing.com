import Link from "next/link";
import LiveHero from "@/components/LiveHero";
import QuietBoundary from "@/components/QuietBoundary";
import { getResume } from "@/lib/resume";
import { getPosts } from "@/lib/posts";
import { sites } from "@/lib/recommending";

/**
 * The four sections ordered by tense rather than by importance. That order
 * is the one true thing about them: doing is now, the rest is record, and
 * recommending points ahead at what is worth your time. Counts come from
 * the real sources, so the index cannot drift from what it points at.
 */
function buildIndex() {
  const resume = getResume();
  const countEntries = (heading: string) => {
    const section = resume.sections.find((s) => s.heading === heading);
    return section?.kind === "entries" ? section.entries.length : 0;
  };
  const roles = countEntries("Experience");
  const projects = countEntries("Projects");
  const essays = getPosts().length;

  return [
    { href: "/doing", tense: "now", label: "Doing", count: "live file readout" },
    { href: "/done", tense: "past", label: "Done", count: `${roles} roles, ${projects} projects` },
    { href: "/thinking", tense: "past", label: "Thinking", count: `${essays} essays` },
    { href: "/recommending", tense: "ahead", label: "Recommending", count: `${sites.length} bookmarks` },
  ];
}

export default function Home() {
  const index = buildIndex();

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 md:px-12">
      <section className="flex min-h-[70vh] flex-col justify-center pt-16 md:min-h-[80vh] md:pt-0">
        <QuietBoundary
          fallback={<p className="text-xs text-trace">The readout is offline.</p>}
        >
          <LiveHero />
        </QuietBoundary>
      </section>

      <nav aria-label="Sections">
        {index.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="row grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 py-4 md:grid-cols-[5rem_1fr_auto] md:gap-x-6"
          >
            <span
              className={`text-[0.6875rem] uppercase tracking-[0.18em] ${
                section.tense === "now" ? "text-live" : "text-trace"
              }`}
            >
              {section.tense}
            </span>
            <span className="text-[0.9375rem]">{section.label}</span>
            <span className="text-xs text-trace">{section.count}</span>
          </Link>
        ))}
      </nav>

      <section className="pt-24">
        <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] leading-tight tracking-tight">
          Josh Keegan is a Fox
        </h2>

        <div className="prose-body mt-8 space-y-5">
          <p>
            The term was mentioned during a{" "}
            <a
              className="underline decoration-rule underline-offset-4 transition-colors hover:text-live hover:decoration-live"
              href="https://youtu.be/HUkBz-cdB-k?t=3258"
            >
              conversation
            </a>{" "}
            between Terence Tao and{" "}
            <a
              className="underline decoration-rule underline-offset-4 transition-colors hover:text-live hover:decoration-live"
              href="https://lexfridman.com/"
            >
              Lex Fridman
            </a>
            .
          </p>

          <blockquote className="border-l border-rule py-1 pl-6 italic">
            A fox knows many things across various fields and can spot analogies and adapt
            techniques from one area to solve problems in another.
          </blockquote>

          <p>
             We used to do geometry with{" "}
            <a
              className="underline decoration-rule underline-offset-4 transition-colors hover:text-live hover:decoration-live"
              href="https://www.youtube.com/watch?v=M-MgQC6z3VU"
            >
              Euclid&apos;s ruler and compass
            </a>
            untill Descartes connected geometry and number theory, permenantly entangling them.
          </p>
          <p>
            Software makes thoughts tangible and energy will define the future. Combining the two allows my thoughts to define the future.
          </p>
        </div>
      </section>
    </div>
  );
}
