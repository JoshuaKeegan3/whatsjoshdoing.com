"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The site's index rail: one vertical hairline with a tick per section,
 * present on every page. Sections are ordered by tense rather than by
 * importance, which is the one true thing about them: learning is what
 * Josh has not done yet, doing is now, the rest is record.
 *
 * Under `md` it collapses to a horizontal bar so the rail never eats
 * width on a phone.
 */
const SECTIONS = [
  { href: "/doing", label: "Doing", tense: "now" },
  { href: "/done", label: "Done", tense: "past" },
  { href: "/thinking", label: "Thinking", tense: "past" },
  { href: "/learning", label: "Learning", tense: "ahead" },
] as const;

export default function Spine() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav
        aria-label="Sections"
        className="no-print fixed inset-y-0 left-0 z-20 hidden w-spine md:block"
      >
        <div className="draw absolute inset-y-0 left-10 w-px bg-rule" aria-hidden />

        <Link
          href="/"
          aria-label="Home"
          className="absolute left-10 top-10 flex size-6 -translate-x-1/2 items-center justify-center"
        >
          <span
            className={`size-1.5 ${pathname === "/" ? "bg-live" : "bg-trace"}`}
            aria-hidden
          />
        </Link>

        <ul className="absolute left-10 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-8">
          {SECTIONS.map((section) => {
            const active = isActive(section.href);
            return (
              <li key={section.href} className="relative flex items-center">
                <span
                  aria-hidden
                  className={`absolute left-0 h-px w-3 -translate-x-1/2 ${
                    active ? "bg-signal" : "bg-rule"
                  }`}
                />
                <Link
                  href={section.href}
                  aria-current={active ? "page" : undefined}
                  className={`pl-4 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors hover:text-signal ${
                    active ? "text-signal" : "text-trace"
                  }`}
                  style={{ writingMode: "vertical-rl" }}
                >
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        aria-label="Sections"
        className="no-print sticky top-0 z-20 flex gap-5 border-b border-rule bg-void px-5 py-3 md:hidden"
      >
        <Link href="/" className="text-[0.6875rem] uppercase tracking-[0.18em] text-trace">
          Home
        </Link>
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            aria-current={isActive(section.href) ? "page" : undefined}
            className={`text-[0.6875rem] uppercase tracking-[0.18em] ${
              isActive(section.href) ? "text-signal" : "text-trace"
            }`}
          >
            {section.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
