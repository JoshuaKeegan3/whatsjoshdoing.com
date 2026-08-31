/**
 * Site-side supplements to `resume/cv.md`, which stays canonical and
 * untouched so it keeps driving the career-ops ATS PDF.
 *
 * `repos` links CV projects that have public source. `shipped` is software
 * that lives on GitHub but is not on the CV; if any of it earns a place on
 * the PDF, move it into cv.md and delete it here.
 */

export const repos: Record<string, string> = {
  "Quantum Wave Packet Simulator":
    "https://www.huntresearchgroup.org.uk/teaching/year2_203_waves2.html",
};

export type Shipped = {
  name: string;
  description: string;
  url: string | null;
};

export const shipped: Shipped[] = [
  {
    name: "zed-convex",
    description:
      "Fork of the Zed editor that broadcasts the current project and file in real time. It is what makes the readout on this site live.",
    url: "https://github.com/JoshuaKeegan3/zed-convex",
  },
  {
    name: "todo",
    description:
      "Terminal UI for browsing TODO comments across a codebase, built on ripgrep and Bubbletea.",
    url: "https://github.com/JoshuaKeegan3/todo",
  },
  {
    name: "Accountability",
    description: "Daily tracker for what actually got done each day.",
    url: "https://github.com/JoshuaKeegan3/accountability",
  },
  {
    name: "linux-meetingbar",
    description: "MeetingBar for Linux and Waybar, showing the next meeting in the status bar.",
    url: null,
  },
];
