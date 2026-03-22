"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import "./whatsHeDone.css";
import LeetCodeStats from "@/components/LeetCodeStats";
import GitHubStats from "@/components/GitHubStats";
import { useSearchParams } from "next/navigation";

type ProjectStatus = "done" | "coming-soon";

type Project = {
  name: string;
  description: string;
  status: ProjectStatus;
  url: string | null;
};

const projects: Project[] = [
  // Production
  {
    name: "zed-convex",
    description: "Zed editor fork that broadcasts your current file and function in real-time",
    status: "done",
    url: "https://github.com/JoshuaKeegan3/zed-convex",
  },
  {
    name: "Accountability",
    description: "Daily accountability app to track what you do each day",
    status: "done",
    url: "https://github.com/JoshuaKeegan3/accountability",
  },
  {
    name: "linux-meetingbar",
    description: "MacOS MeetingBar clone built for Linux and Waybar",
    status: "done",
    url: null,
  },
  {
    name: "todo",
    description: "TUI for browsing TODO comments in your codebase using ripgrep and Bubbletea",
    status: "done",
    url: "https://github.com/JoshuaKeegan3/todo",
  },
  {
    name: "Electron",
    description: "Physics and waves simulation",
    status: "done",
    url: "https://www.huntresearchgroup.org.uk/teaching/year2_203_waves2.html",
  },
  // Coming soon
  {
    name: "you-are-what-you-eat",
    description: "Nutrition tracking app inspired by the twin experiment — know what you're actually eating",
    status: "coming-soon",
    url: null,
  },
  {
    name: "Hangar Climbing",
    description: "Interactive gym map and global climbing social network",
    status: "coming-soon",
    url: null,
  },
  {
    name: "Extensible Chat for AI",
    description: "Secure encrypted messaging built for the era of personal AI — WhatsApp meets VS Code",
    status: "coming-soon",
    url: null,
  },
  {
    name: "Deals & Events",
    description: "Wellington deals and events aggregator",
    status: "coming-soon",
    url: null,
  },
  {
    name: "Contractor Manager",
    description: "Mobile app for managing contractors and their assigned tasks",
    status: "coming-soon",
    url: null,
  },
  {
    name: "Learning Website",
    description: "Renewable energy master's course resource with live simulations",
    status: "coming-soon",
    url: null,
  },
  {
    name: "Turing Test",
    description: "AI agent designed to convincingly pass a Turing test",
    status: "coming-soon",
    url: null,
  },
];

type ProjectCard = {
  id: number;
  project: Project;
  top: string;
  left: string;
};

const generateCards = (projects: Project[]): ProjectCard[] => {
  const rings = [
    { count: 6, radiusPx: 340 },
    { count: 8, radiusPx: 560 },
  ];

  const cards: ProjectCard[] = [];
  let projectIndex = 0;

  rings.forEach((ring) => {
    const angleIncrement = (2 * Math.PI) / ring.count;
    for (let i = 0; i < ring.count; i++) {
      if (projectIndex >= projects.length) break;
      const angle = i * angleIncrement;
      cards.push({
        id: projectIndex,
        project: projects[projectIndex],
        top: `calc(50% + ${Math.round(ring.radiusPx * Math.sin(angle))}px)`,
        left: `calc(50% + ${Math.round(ring.radiusPx * Math.cos(angle))}px)`,
      });
      projectIndex++;
    }
  });

  return cards;
};

const cards = generateCards(projects);

function WhatsHeDoneContent() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [scrollTopStart, setScrollTopStart] = useState(0);
  const searchParams = useSearchParams();
  const noanim = searchParams.get("noanim") === "true";

  useEffect(() => {
    if (canvasRef.current && canvasContentRef.current) {
      const canvas = canvasRef.current;
      const canvasContent = canvasContentRef.current;
      canvas.scrollTop = (canvasContent.clientHeight - canvas.clientHeight) / 2;
      canvas.scrollLeft = (canvasContent.clientWidth - canvas.clientWidth) / 2;
    }

    const cardElements = document.querySelectorAll(".scroll-button");
    if (noanim) {
      cardElements.forEach((el) => el.classList.add("no-anim-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.01, root: canvasRef.current },
    );

    cardElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [noanim]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - canvasRef.current.offsetLeft);
    setStartY(e.pageY - canvasRef.current.offsetTop);
    setScrollLeftStart(canvasRef.current.scrollLeft);
    setScrollTopStart(canvasRef.current.scrollTop);
    canvasRef.current.classList.add("grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !canvasRef.current) return;
    e.preventDefault();
    const x = e.pageX - canvasRef.current.offsetLeft;
    const y = e.pageY - canvasRef.current.offsetTop;
    canvasRef.current.scrollLeft = scrollLeftStart - (x - startX);
    canvasRef.current.scrollTop = scrollTopStart - (y - startY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    canvasRef.current?.classList.remove("grabbing");
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    canvasRef.current?.classList.remove("grabbing");
  };

  return (
    <div
      className="canvas"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="canvas-content" ref={canvasContentRef}>
        <div className="center-content">
          <h1 className="title">What&apos;s He Done</h1>
          <div className="stats-row">
            <div className="stat-block">
              <p className="stat-label">LeetCode</p>
              <LeetCodeStats />
            </div>
            <div className="stat-block">
              <p className="stat-label">GitHub</p>
              <GitHubStats />
            </div>
          </div>
        </div>

        {cards.map((card) => {
          const cardEl = (
            <div
              className={`scroll-button project-card${card.project.status === "coming-soon" ? " coming-soon-card" : ""}`}
              style={{ top: card.top, left: card.left }}
            >
              <span
                className={`project-badge ${card.project.status === "coming-soon" ? "badge-soon" : "badge-done"}`}
              >
                {card.project.status === "coming-soon" ? "Coming Soon" : "Done"}
              </span>
              <h3 className="project-name">{card.project.name}</h3>
              <p className="project-desc">{card.project.description}</p>
              {card.project.status === "coming-soon" && (
                <div className="coming-soon-overlay" />
              )}
            </div>
          );

          if (card.project.url) {
            return (
              <a
                key={card.id}
                href={card.project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "contents" }}
              >
                {cardEl}
              </a>
            );
          }

          return <div key={card.id} style={{ display: "contents" }}>{cardEl}</div>;
        })}
      </div>
    </div>
  );
}

export default function WhatsHeDone() {
  return (
    <Suspense>
      <WhatsHeDoneContent />
    </Suspense>
  );
}
