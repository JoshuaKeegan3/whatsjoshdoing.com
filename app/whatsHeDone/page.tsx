"use client";

import { useEffect, useRef, useState } from "react";
import "./whatsHeDone.css";

const buttons = [
  { id: 1, label: "Project 1", top: "40%", left: "40%" },
  { id: 2, label: "Project 2", top: "60%", left: "60%" },
  { id: 3, label: "Project 3", top: "50%", left: "30%" },
  { id: 4, label: "Project 4", top: "30%", left: "70%" },
  { id: 5, label: "Project 5", top: "70%", left: "20%" },
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
    const handleScroll = () => {
      const buttonElements = document.querySelectorAll(".scroll-button");
      buttonElements.forEach((button) => {
        const rect = button.getBoundingClientRect();
        if (
          rect.top < window.innerHeight &&
          rect.bottom >= 0 &&
          rect.left < window.innerWidth &&
          rect.right >= 0
        ) {
          button.classList.add("visible");
        } else {
          button.classList.remove("visible");
        }
      });
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }

    // Center the view on load
    if (canvas && canvasContentRef.current) {
      const canvasContent = canvasContentRef.current;
      canvas.scrollTop = (canvasContent.clientHeight - canvas.clientHeight) / 2;
      canvas.scrollLeft = (canvasContent.clientWidth - canvas.clientWidth) / 2;
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("scroll", handleScroll);
      }
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
          <button
            key={button.id}
            className="scroll-button"
            style={{ top: button.top, left: button.left }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
