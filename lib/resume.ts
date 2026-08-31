import fs from "node:fs";
import path from "node:path";
import z from "zod";

/**
 * Parses `resume/cv.md`, a copy of the canonical CV master in ~/career-ops.
 * Refresh it with `pnpm sync:cv` (set CV_SOURCE to copy from elsewhere).
 *
 * The same master drives the ATS PDF, so this parser reads the shape of the
 * markdown rather than hardcoding section names: rename a heading in cv.md
 * and the page still renders it correctly.
 *
 * Recognised shapes:
 *   entries  section contains `### Title | Org | Period` blocks
 *   skills   every line is `**Category:** comma, separated, items`
 *   list     every line is `- Item | Meta`
 *   prose    anything else
 */

/** A line inside an entry body. `label` is a bold run that groups the bullets under it. */
export type Block =
  | { kind: "bullet"; text: string }
  | { kind: "label"; text: string }
  | { kind: "prose"; text: string };

export type Entry = {
  title: string;
  org: string | null;
  period: string | null;
  /** First four-digit year in `period`, used to place the entry on the year rail. */
  year: number | null;
  /** True while the role is ongoing, which is the only thing on the page that gets the live accent. */
  current: boolean;
  body: Block[];
};

export type Section =
  | { kind: "entries"; heading: string; entries: Entry[] }
  | { kind: "skills"; heading: string; groups: { category: string; items: string[] }[] }
  | { kind: "list"; heading: string; items: { text: string; meta: string | null }[] }
  | { kind: "prose"; heading: string; text: string };

export type Contact = {
  location: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
};

export type Resume = {
  name: string;
  title: string;
  contact: Contact;
  sections: Section[];
};

/** cv.md is written for print, where em dashes are fine. The site is not. */
const normalise = (s: string) =>
  s.replace(/\s*—\s*/g, ": ").replace(/\*\*/g, "").trim();

const splitOnPipe = (s: string) => s.split("|").map((p) => p.trim());

const yearOf = (period: string | null) => {
  const match = period?.match(/\d{4}/);
  return match ? Number(match[0]) : null;
};

function parseContact(lines: string[]): Contact {
  const parts = lines.flatMap((l) => l.split("·")).map((p) => p.trim()).filter(Boolean);
  const find = (test: (p: string) => boolean) => parts.find(test) ?? null;
  const strip = (value: string | null, prefix: string) =>
    value ? value.slice(prefix.length).trim() : null;

  return {
    // The phone number in cv.md is deliberately not surfaced: this page is indexed.
    email: find((p) => p.includes("@")),
    github: strip(find((p) => p.startsWith("GitHub:")), "GitHub:"),
    linkedin: strip(find((p) => p.startsWith("LinkedIn:")), "LinkedIn:"),
    location: find((p) => !p.includes("@") && !/\d{3}/.test(p) && !p.includes(":")),
  };
}

function parseEntries(body: string[]): Entry[] {
  const entries: Entry[] = [];

  for (const line of body) {
    if (line.startsWith("### ")) {
      const [title, org = null, period = null] = splitOnPipe(line.slice(4));
      entries.push({
        title,
        org,
        period,
        year: yearOf(period),
        current: /present|expected/i.test(period ?? ""),
        body: [],
      });
      continue;
    }

    const entry = entries.at(-1);
    if (!entry) continue;

    if (line.startsWith("- ")) {
      entry.body.push({ kind: "bullet", text: normalise(line.slice(2)) });
    } else if (line.startsWith("**")) {
      entry.body.push({ kind: "label", text: normalise(line).replace(/:$/, "") });
    } else {
      entry.body.push({ kind: "prose", text: normalise(line) });
    }
  }

  return entries;
}

function parseSection(heading: string, body: string[]): Section {
  if (body.some((l) => l.startsWith("### "))) {
    return { kind: "entries", heading, entries: parseEntries(body) };
  }

  if (body.every((l) => /^\*\*.+:\*\*\s*\S/.test(l))) {
    return {
      kind: "skills",
      heading,
      groups: body.map((line) => {
        const [category, items] = line.split(":**");
        return {
          category: category.replace("**", "").trim(),
          items: items.split(",").map((i) => i.trim()).filter(Boolean),
        };
      }),
    };
  }

  if (body.every((l) => l.startsWith("- "))) {
    return {
      kind: "list",
      heading,
      items: body.map((line) => {
        const [text, meta = null] = splitOnPipe(line.slice(2));
        return { text: normalise(text), meta };
      }),
    };
  }

  return { kind: "prose", heading, text: body.map(normalise).join(" ") };
}

/** Fails the build loudly if cv.md drifts into a shape this parser no longer understands. */
const resumeSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  contact: z.object({
    location: z.string().nullable(),
    email: z.string().nullable(),
    github: z.string().nullable(),
    linkedin: z.string().nullable(),
  }),
  sections: z
    .array(
      z.union([
        z.object({
          kind: z.literal("entries"),
          heading: z.string(),
          entries: z.array(z.object({ title: z.string().min(1) }).loose()).min(1),
        }).loose(),
        z.object({ kind: z.literal("skills") }).loose(),
        z.object({ kind: z.literal("list") }).loose(),
        z.object({ kind: z.literal("prose") }).loose(),
      ]),
    )
    .min(1),
});

export function getResume(): Resume {
  const raw = fs.readFileSync(path.join(process.cwd(), "resume", "cv.md"), "utf-8");
  const lines = raw.split("\n").map((l) => l.trimEnd());

  const name = lines.find((l) => l.startsWith("# "))?.slice(2).trim() ?? "";
  const headerEnd = lines.findIndex((l) => l.startsWith("## "));
  const header = lines.slice(0, headerEnd).filter(Boolean);
  const title = header.find((l) => /^\*\*.+\*\*$/.test(l))?.replace(/\*\*/g, "").trim() ?? "";
  const contact = parseContact(header.filter((l) => !l.startsWith("#") && !l.startsWith("**")));

  const sections: Section[] = [];
  let heading: string | null = null;
  let body: string[] = [];

  const flush = () => {
    if (heading && body.length) sections.push(parseSection(heading, body));
  };

  for (const line of lines.slice(headerEnd)) {
    if (line.startsWith("## ")) {
      flush();
      heading = line.slice(3).trim();
      body = [];
    } else if (line.trim()) {
      body.push(line.trim());
    }
  }
  flush();

  return resumeSchema.parse({ name, title, contact, sections }) as Resume;
}
