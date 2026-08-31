export type Site = {
  title: string;
  url: string;
  description: string;
  category: string;
};

/**
 * Grouped by category on the page. Colour is deliberately not a field:
 * amber means "live" everywhere on this site, so a per-category palette
 * would spend the one accent on decoration.
 */
export const sites: Site[] = [
  {
    title: "The Farmer Was Replaced",
    url: "https://thefarmerwasreplaced.com/",
    description: "A game that teaches a Python-adjacent programming language by automating a farm.",
    category: "Programming",
  },
  {
    title: "Build Your Own X",
    url: "https://github.com/codecrafters-io/build-your-own-x",
    description:
      "Step-by-step rebuilds of the tools you use daily: databases, git, shells, compilers, operating systems, neural networks.",
    category: "Programming",
  },
  {
    title: "Free for Dev",
    url: "https://github.com/ripienaar/free-for-dev",
    description:
      "SaaS, PaaS and IaaS with free tiers for developers. Hosting, CI, monitoring, databases.",
    category: "Programming",
  },
  {
    title: "Developer Roadmap",
    url: "https://github.com/nilbuild/developer-roadmap",
    description:
      "Visual learning paths across frontend, backend and DevOps. What to learn, and in what order.",
    category: "Programming",
  },
  {
    title: "Best Websites a Programmer Should Visit",
    url: "https://github.com/sdmg15/Best-websites-a-programmer-should-visit",
    description:
      "Long-running index of practice platforms, CS courses, blogs, newsletters, tooling and interview prep.",
    category: "Programming",
  },
  {
    title: "Textbooks and Papers",
    url: "https://github.com/GeorgeQLe/Textbooks-and-Papers/tree/master",
    description:
      "Computer science textbooks and foundational papers sorted by subject: theory, systems, languages, mathematics.",
    category: "Programming",
  },
  {
    title: "IRENA Global Atlas",
    url: "https://globalatlas.irena.org/",
    description:
      "Interactive global map of renewable energy resources. Shows where solar, wind and hydro potential actually exists.",
    category: "Energy",
  },
  {
    title: "Open Grid Works: Power Plants",
    url: "https://opengridworks.com/power-plants",
    description:
      "US power plants mapped by fuel type, capacity and ownership. Useful for reading the physical grid.",
    category: "Energy",
  },
  {
    title: "LLM Architecture Gallery",
    url: "https://sebastianraschka.com/llm-architecture-gallery/",
    description:
      "Visual reference of modern LLM architectures: attention mechanisms, positional encodings, training techniques.",
    category: "AI and ML",
  },
  {
    title: "CircuitJS",
    url: "https://www.falstad.com/circuit/circuitjs.html",
    description:
      "Browser circuit simulator. Build and probe resistors, capacitors, logic gates and op-amps in real time.",
    category: "Electronics",
  },
  {
    title: "Calitree",
    url: "https://calitree.app/",
    description:
      "Calisthenics skill tree. Visualises progressions and prerequisites for planning a structured training path.",
    category: "Fitness",
  },
  {
    title: "Security Certification Roadmap",
    url: "https://pauljerimy.com/security-certification-roadmap/",
    description: "Cybersecurity certifications mapped by domain and difficulty.",
    category: "Security",
  },
];
