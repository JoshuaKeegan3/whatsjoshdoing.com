import type { Metadata } from "next";
import { getResume, type Entry, type Section } from "@/lib/resume";
import { repos, shipped } from "@/resume/links";

export const metadata: Metadata = {
  title: "Done · Josh Keegan",
  description: "The record: roles, study, and shipped work.",
};

/** Section heading. The rail below it is this page's time axis. */
function Heading({ children }: { children: string }) {
  return <h2 className="label mb-4 pt-14">{children}</h2>;
}

/**
 * Year ticks sit at the top edge of each entry rather than scaled to
 * duration: proportional spacing opens dead gaps and misrepresents a
 * three-bullet year against a five-bullet one.
 */
function EntryRow({ entry, showYear }: { entry: Entry; showYear: boolean }) {
  const url = repos[entry.title];
  const heading = (
    <h3 className="text-[0.9375rem] leading-snug text-signal">{entry.title}</h3>
  );

  return (
    <article
      className={
        showYear
          ? "entry-row row grid grid-cols-[3.25rem_1fr] gap-x-5 py-5 md:grid-cols-[4.5rem_1fr] md:gap-x-8"
          : "row py-5"
      }
    >
      {showYear && <div className="text-xs text-trace">{entry.year ?? ""}</div>}

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="print-url hover:text-live"
            >
              {heading}
            </a>
          ) : (
            heading
          )}
          {entry.org && <span className="text-xs text-trace">{entry.org}</span>}
        </div>

        {entry.period && (
          <p className="mt-1 text-xs text-trace">
            {entry.period}
            {entry.current && <span className="text-live"> · current</span>}
          </p>
        )}

        {entry.body.length > 0 && (
          <div className="prose-body mt-3 space-y-1">
            {entry.body.map((block, i) =>
              block.kind === "label" ? (
                <p key={i} className="label pt-2 font-mono">
                  {block.text}
                </p>
              ) : block.kind === "bullet" ? (
                <p key={i} className="flex gap-3">
                  <span className="bullet-dot mt-[0.7em] size-1 shrink-0 bg-trace" aria-hidden />
                  <span>{block.text}</span>
                </p>
              ) : (
                <p key={i}>{block.text}</p>
              ),
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function RenderSection({ section }: { section: Section }) {
  switch (section.kind) {
    case "prose":
      return (
        <section>
          <Heading>{section.heading}</Heading>
          <p className="prose-body">{section.text}</p>
        </section>
      );

    case "entries": {
      // Undated sections (Projects) drop the rail rather than leaving a gutter.
      const showYear = section.entries.some((entry) => entry.year !== null);
      return (
        <section>
          <Heading>{section.heading}</Heading>
          {section.entries.map((entry) => (
            <EntryRow
              key={`${entry.title}-${entry.org ?? ""}`}
              entry={entry}
              showYear={showYear}
            />
          ))}
        </section>
      );
    }

    case "list":
      return (
        <section>
          <Heading>{section.heading}</Heading>
          {section.items.map((item) => (
            <div
              key={item.text}
              className="row flex items-baseline justify-between gap-6 py-2.5 text-[0.8125rem]"
            >
              <span>{item.text}</span>
              {item.meta && <span className="shrink-0 text-xs text-trace">{item.meta}</span>}
            </div>
          ))}
        </section>
      );

    case "skills":
      return (
        <section>
          <Heading>{section.heading}</Heading>
          {section.groups.map((group) => (
            <div
              key={group.category}
              className="skills-row row grid grid-cols-1 gap-x-8 gap-y-1 py-3 md:grid-cols-[9rem_1fr]"
            >
              <p className="label pt-0.5">{group.category}</p>
              <p className="text-[0.8125rem] leading-relaxed">{group.items.join(", ")}</p>
            </div>
          ))}
        </section>
      );
  }
}

export default function DonePage() {
  const resume = getResume();
  const { contact } = resume;

  const links = [
    contact.email ? { label: contact.email, href: `mailto:${contact.email}` } : null,
    contact.github
      ? {
          label: `github.com/${contact.github}`,
          href: `https://github.com/${contact.github}`,
        }
      : null,
    contact.linkedin
      ? {
          label: `linkedin.com/${contact.linkedin}`,
          href: `https://linkedin.com/${contact.linkedin}`,
        }
      : null,
  ].filter((link) => link !== null);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-16 md:px-12 md:pt-24">
      <header className="rise">
        <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] leading-none tracking-tight">
          {resume.name}
        </h1>
        <p className="mt-3 text-sm text-trace">
          {resume.title}
          {contact.location && ` · ${contact.location}`}
        </p>
        <div className="contact-row mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-trace">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-live">
              {link.label}
            </a>
          ))}
        </div>
      </header>

      {resume.sections.map((section) => (
        <div key={section.heading}>
          <RenderSection section={section} />

          {/* Repo-only work, kept next to the CV's own project list. */}
          {section.heading === "Projects" && (
            <section>
              <Heading>Shipped</Heading>
              {shipped.map((project) => {
                const inner = (
                  <>
                    <h3 className="text-[0.9375rem] text-signal">{project.name}</h3>
                    <p className="prose-body mt-1">{project.description}</p>
                  </>
                );
                return project.url ? (
                  <a
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="print-url row block py-5 hover:[&_h3]:text-live"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={project.name} className="row py-5">
                    {inner}
                  </div>
                );
              })}
            </section>
          )}
        </div>
      ))}
    </div>
  );
}
