"use client";

import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils/css";

interface TitleTooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  maxHeight?: number;
}

function TitleTooltip({ text, children, className, maxHeight = 400 }: TitleTooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clamp tooltip horizontally without an extra re-render
  useLayoutEffect(() => {
    if (!pos || !tooltipRef.current) return;
    const { width } = tooltipRef.current.getBoundingClientRect();
    const padding = 8;
    const clamped = Math.max(
      width / 2 + padding,
      Math.min(pos.x, window.innerWidth - width / 2 - padding),
    );
    tooltipRef.current.style.left = `${clamped}px`;
  }, [pos]);

  // Hide and cancel pending show on page scroll
  useEffect(() => {
    const hide = () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      setPos(null);
    };

    const getScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
      if (!el) return window;
      const { overflow, overflowY, overflowX } = getComputedStyle(el);
      if (/auto|scroll/.test(overflow + overflowY + overflowX)) return el;
      return getScrollParent(el.parentElement);
    };

    const scrollTarget = getScrollParent(wrapperRef.current?.parentElement ?? null);
    scrollTarget.addEventListener("scroll", hide, { passive: true });
    return () => scrollTarget.removeEventListener("scroll", hide);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    hideTimerRef.current = setTimeout(() => setPos(null), 100);
  }, []);

  const handleMouseEnter = useCallback(() => {
    cancelHide();
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    showTimerRef.current = setTimeout(
      () => setPos({ x: rect.left + rect.width / 2, y: rect.top }),
      500,
    );
  }, [cancelHide]);

  const handleMouseLeave = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    scheduleHide();
  }, [scheduleHide]);

  return (
    <div
      ref={wrapperRef}
      className={cn("min-w-0", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {pos &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999]"
            style={{ left: pos.x, top: pos.y - 8, transform: "translate(-50%, -100%)" }}
            onMouseEnter={cancelHide}
            onMouseLeave={scheduleHide}
          >
            <div
              className="tooltip-content relative z-[101] max-w-[480px] overflow-y-auto text-xs text-black bg-white whitespace-pre-wrap break-words [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-thumb]:rounded-full"
              style={{ maxHeight }}
              onWheel={(e) => e.stopPropagation()}
            >
              {text}
            </div>
            <div className="tooltip-arrow bg-white" />
          </div>,
          document.body,
        )}
    </div>
  );
}

export default TitleTooltip;
