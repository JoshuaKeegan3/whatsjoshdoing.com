"use client";

import { useEffect, useRef, useState } from "react";
import "./whatsHeDone.css";

const repositories = [
  { repoUrl: "./", imageUrl: "/file.svg" },
  { repoUrl: "./", imageUrl: "/globe.svg" },
  { repoUrl: "./", imageUrl: "/next.svg" },
  { repoUrl: "./", imageUrl: "/vercel.svg" },
  { repoUrl: "./", imageUrl: "/window.svg" },
  { repoUrl: "./", imageUrl: "/file.svg" },
  { repoUrl: "./", imageUrl: "/globe.svg" },
  { repoUrl: "./", imageUrl: "/next.svg" },
  { repoUrl: "./", imageUrl: "/vercel.svg" },
  { repoUrl: "./", imageUrl: "/window.svg" },
  { repoUrl: "./", imageUrl: "/file.svg" },
  { repoUrl: "./", imageUrl: "/globe.svg" },
  { repoUrl: "./", imageUrl: "/next.svg" },
];

const generateButtons = (repos: typeof repositories) => {
  const rings = [
    { count: 5, radius: 10 },
    { count: 8, radius: 20 },
  ];

  let buttons: any[] = [];
  let repoIndex = 0;

  rings.forEach((ring, ringIndex) => {
    const angle_increment = (2 * Math.PI) / ring.count;
    for (let i = 0; i < ring.count; i++) {
      if (repoIndex >= repos.length) break;
      const angle = i * angle_increment;
      const left = 50 + ring.radius * Math.cos(angle);
      const top = 50 + ring.radius * Math.sin(angle);
      buttons.push({
        id: repoIndex,
        imageUrl: repos[repoIndex].imageUrl,
        top: `${top}%`,
        left: `${left}%`,
        repoUrl: repos[repoIndex].repoUrl,
      });
      repoIndex++;
    }
  });

  return buttons;
};

const buttons = generateButtons(repositories);

export default function WhatsHeDone() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [scrollTopStart, setScrollTopStart] = useState(0);

  useEffect(() => {
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

    const buttonElements = document.querySelectorAll(".scroll-button");
    buttonElements.forEach((button) => {
      observer.observe(button);
    });

    if (canvasRef.current && canvasContentRef.current) {
      const canvas = canvasRef.current;
      const canvasContent = canvasContentRef.current;
      canvas.scrollTop = (canvasContent.clientHeight - canvas.clientHeight) / 2;
      canvas.scrollLeft = (canvasContent.clientWidth - canvas.clientWidth) / 2;
    }

    return () => {
      observer.disconnect();
    };
  }, []);

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
    const walkX = (x - startX) * 1; // The multiplier determines the scroll speed
    const walkY = (y - startY) * 1;
    canvasRef.current.scrollLeft = scrollLeftStart - walkX;
    canvasRef.current.scrollTop = scrollTopStart - walkY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (canvasRef.current) {
      canvasRef.current.classList.remove("grabbing");
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (canvasRef.current) {
      canvasRef.current.classList.remove("grabbing");
    }
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
          <h1 className="title">What's He Done</h1>
        </div>
        {buttons.map((button) => (
          <a
            href={button.repoUrl}
            key={button.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={button.imageUrl}
              className="scroll-button"
              style={{ top: button.top, left: button.left }}
              alt={`Project ${button.id}`}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
