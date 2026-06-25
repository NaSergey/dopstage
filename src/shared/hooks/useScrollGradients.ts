import { useRef, useEffect, useState, RefObject } from "react";

export interface UseScrollSentinelsOptions {
  onTopIntersect?: () => void;
  onBottomIntersect?: () => void;
}

export function useScrollSentinels({
  onTopIntersect,
  onBottomIntersect,
}: UseScrollSentinelsOptions = {}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  const [isTopVisible, setIsTopVisible] = useState(true);
  const [isBottomVisible, setIsBottomVisible] = useState(true);

  // Store callbacks in refs to avoid re-creating the observer when they change
  const callbacksRef = useRef({ onTopIntersect, onBottomIntersect });
  useEffect(() => {
    callbacksRef.current = { onTopIntersect, onBottomIntersect };
  }, [onTopIntersect, onBottomIntersect]);

  useEffect(() => {
    const topSentinel = topSentinelRef.current;
    const bottomSentinel = bottomSentinelRef.current;
    const container = scrollContainerRef.current;

    if (!topSentinel || !bottomSentinel || !container) {
      return;
    }

    // Create Intersection Observer for detecting when sentinels are visible
    const observerOptions: IntersectionObserverInit = {
      root: container,
      rootMargin: "0px",
      threshold: [0, 1],
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.isIntersecting;

        if (entry.target === topSentinel) {
          // Top sentinel: use threshold 0 - visible when any part is visible
          setIsTopVisible(isIntersecting);
          if (isIntersecting) {
            callbacksRef.current.onTopIntersect?.();
          }
        } else if (entry.target === bottomSentinel) {
          // Bottom sentinel
          // Gradient logic: Hide when mostly visible (>0.5 to be safe)
          setIsBottomVisible(entry.isIntersecting && entry.intersectionRatio > 0.5);

          // Infinite scroll logic: Trigger as soon as sentinel enters viewport
          if (entry.isIntersecting) {
            callbacksRef.current.onBottomIntersect?.();
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe both sentinel elements
    observer.observe(topSentinel);
    observer.observe(bottomSentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    scrollContainerRef: scrollContainerRef as RefObject<HTMLDivElement>,
    topSentinelRef: topSentinelRef as RefObject<HTMLDivElement>,
    bottomSentinelRef: bottomSentinelRef as RefObject<HTMLDivElement>,
    isTopVisible,
    isBottomVisible,
  };
}
