import Link from "next/link";

type Site = {
  title: string;
  url: string;
  description: string;
  category: string;
  categoryColor: string;
};

const sites: Site[] = [
{
		title: "The farmer was replaced",
		url: "thefarmerwasreplaced.com/",
		description: "A game that teaches you a python ajacent programmming language",
    category: "Programming",
    categoryColor: "text-purple-400",
},
  {
    title: "Build Your Own X",
    url: "https://github.com/codecrafters-io/build-your-own-x",
    description:
      "Collection of step-by-step tutorials for rebuilding the tools you use daily — databases, git, shells, compilers, operating systems, neural networks.",
    category: "Programming",
    categoryColor: "text-purple-400",
  },
  {
    title: "Free for Dev",
    url: "https://github.com/ripienaar/free-for-dev",
    description:
      "Curated list of SaaS, PaaS, and IaaS offerings with free tiers for developers — hosting, CI, monitoring, databases, and more.",
    category: "Programming",
    categoryColor: "text-purple-400",
  },
  {
    title: "Developer Roadmap",
    url: "https://github.com/nilbuild/developer-roadmap",
    description:
      "Visual roadmaps for learning paths across frontend, backend, DevOps, and related roles — what to learn and in what order.",
    category: "Programming",
    categoryColor: "text-purple-400",
  },
  {
    title: "Best Websites a Programmer Should Visit",
    url: "https://github.com/sdmg15/Best-websites-a-programmer-should-visit",
    description:
      "Long-running index of sites worth knowing about — practice platforms, CS courses, blogs, newsletters, tooling, and interview prep.",
    category: "Programming",
    categoryColor: "text-purple-400",
  },
  {
    title: "Textbooks and Papers",
    url: "https://github.com/GeorgeQLe/Textbooks-and-Papers/tree/master",
    description:
      "Reading list of computer science textbooks and foundational papers, sorted by subject — theory, systems, languages, and mathematics.",
    category: "Programming",
    categoryColor: "text-purple-400",
  },
  {
    title: "IRENA Global Atlas",
    url: "https://globalatlas.irena.org/",
    description:
      "IRENA's interactive global map of renewable energy resources — solar, wind, hydro, and more. Useful for understanding where renewable potential exists worldwide.",
    category: "Energy",
    categoryColor: "text-yellow-400",
  },
  {
    title: "Open Grid Works — Power Plants",
    url: "https://opengridworks.com/power-plants",
    description:
      "Interactive map of US power plants by fuel type, capacity, and ownership. Great for understanding the physical energy grid.",
    category: "Energy",
    categoryColor: "text-yellow-400",
  },
  {
    title: "LLM Architecture Gallery",
    url: "https://sebastianraschka.com/llm-architecture-gallery/",
    description:
      "Sebastian Raschka's visual reference of modern LLM architectures — attention mechanisms, positional encodings, training techniques.",
    category: "AI / ML",
    categoryColor: "text-blue-400",
  },
  {
    title: "CircuitJS",
    url: "https://www.falstad.com/circuit/circuitjs.html",
    description:
      "Browser-based circuit simulator. Build and probe circuits in real time — resistors, capacitors, logic gates, op-amps.",
    category: "Electronics",
    categoryColor: "text-green-400",
  },
  {
    title: "Calitree",
    url: "https://calitree.app/",
    description:
      "Interactive calisthenics skill tree. Visualises progressions and prerequisites across bodyweight movements — useful for planning a structured training path.",
    category: "Fitness",
    categoryColor: "text-orange-400",
  },
  {
    title: "Security Certification Roadmap",
    url: "https://pauljerimy.com/security-certification-roadmap/",
    description:
      "Paul Jerimy's comprehensive map of cybersecurity certifications organised by domain and difficulty.",
    category: "Security",
    categoryColor: "text-red-400",
  },
];

export default function LearningPage() {
  return (
    <main className="relative min-h-screen px-10 py-20 max-w-3xl mx-auto overflow-hidden">
      {/* perspective grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          transform: "perspective(600px) rotateX(8deg)",
          transformOrigin: "top center",
        }}
      />

      <h1 className="text-5xl font-bold tracking-widest uppercase mb-4">
        Learning
      </h1>
      <p className="text-muted-foreground mb-16 text-sm">
        Sites worth bookmarking.
      </p>

      <ul className="space-y-4">
        {sites.map((site) => (
          <li key={site.url}>
            <Link
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card block p-6"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <span
                  className={`text-xs font-semibold uppercase tracking-widest ${site.categoryColor}`}
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {site.category}
                </span>
                <span className="text-muted-foreground text-xs shrink-0 group-hover:text-red-500 transition-colors">
                  ↗
                </span>
              </div>

              <h2 className="text-lg font-semibold group-hover:text-red-500 transition-colors mb-2">
                {site.title}
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {site.description}
              </p>

              <p
                className="text-xs text-muted-foreground mt-3 opacity-50 truncate"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {site.url}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
