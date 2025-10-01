"use client";

import { useEffect, useRef, useState } from "react";
import "./whatsHeDone.css";

const buttons = [
  { id: 1, imageUrl: "/file.svg", top: "40%", left: "40%" },
  { id: 2, imageUrl: "/globe.svg", top: "60%", left: "60%" },
  { id: 3, imageUrl: "/next.svg", top: "50%", left: "30%" },
  { id: 4, imageUrl: "/vercel.svg", top: "30%", left: "70%" },
  { id: 5, imageUrl: "/window.svg", top: "70%", left: "20%" },
];

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

    // Center the view on load
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
    const walkX = (x - startX) * 2; // The multiplier determines the scroll speed
    const walkY = (y - startY) * 2;
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
          <a href="./" key={button.id}>
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
