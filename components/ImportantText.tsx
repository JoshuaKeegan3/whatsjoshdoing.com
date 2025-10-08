"use client";

import { useState, useEffect } from "react";
type ImporantTextProps = {
  animate_text?: boolean;
  color?: boolean;
  zoom: boolean;
  text: string;
};
export default function ImportantText(props: ImporantTextProps) {
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateText(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`tracking-[-.01em] pl-1.5 pr-1.5 transition-all duration-700 ease-out transform
        ${props.color ? "animated-gradient origin-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent" : ""}
        ${props.zoom ? `${animateText ? "opacity-100 scale-100" : "opacity-100 scale-[5]"}` : ""}
      `}
    >
      {props.text}
    </div>
  );
}
