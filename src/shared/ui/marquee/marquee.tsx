"use client";

import React, { CSSProperties, useRef, useLayoutEffect } from "react";
import { cn } from "@/shared/lib/utils/css";
import "./index.css";

interface IMarqueeProps {
  children: React.ReactNode;
  className?: string;
  speedSec?: number; // Deprecated: use speedPxPerSec instead
  speedPxPerSec?: number; // Speed in pixels per second
  gap?: string;
}

export function Marquee({
  children,
  className,
  speedSec,
  speedPxPerSec = 50,
  gap = "2rem",
}: IMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!marqueeRef.current) return;

    if (speedSec) {
      marqueeRef.current.style.setProperty("--dur", `${speedSec}s`);
      return;
    }

    if (!trackRef.current) return;

    const distance = trackRef.current.scrollWidth / 2;
    marqueeRef.current.style.setProperty("--dur", `${distance / speedPxPerSec}s`);
  }, [speedSec, speedPxPerSec, children]);

  return (
    <div className="relative w-full">
      <div
        ref={marqueeRef}
        className={cn("marquee", className)}
        style={{
          ["--gap" as keyof CSSProperties]: gap,
        }}
        aria-label="Scrolling content"
      >
        <div className="marquee__content">
          <div className="marquee__track" ref={trackRef}>
            {children}
          </div>
          <div className="marquee__track" aria-hidden>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marquee;
