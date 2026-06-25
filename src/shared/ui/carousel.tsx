"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/shared/lib/utils/css";
import { CarouselArrowIcon } from "@/shared/ui/icons";

type TItem = {
  id: string | number;
  node: React.ReactNode;
};

interface ICarouselProps {
  items: TItem[];
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  minItemsToRun?: number;
  interactive?: boolean;
  showControls?: boolean;
  autoScroll?: boolean;
  controlsClassName?: string;
}

function CarouselComponent({
  items,
  loop = true,
  autoplay = true,
  className,
  minItemsToRun = 7,
  interactive = true,
  showControls = false,
  autoScroll = false,
  controlsClassName,
}: ICarouselProps) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const shouldRun = interactive && autoplay && items.length > minItemsToRun;

  const autoplayPlugin = useMemo(
    () => shouldRun ? [Autoplay({ delay: 1500, jump: false, stopOnInteraction: false, stopOnMouseEnter: false })] : [],
    [shouldRun]
  );

  const emblaOptions = useMemo(
    () => ({
      loop: loop && items.length >= minItemsToRun,
      align: "start" as const,
      dragFree: interactive,
      draggable: interactive,
      containScroll: "trimSnaps" as const,
    }),
    [loop, items.length, minItemsToRun, interactive]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, autoplayPlugin);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollState();

    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);

    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  // Prevent drag when interactive is false
  useEffect(() => {
    if (!emblaApi || interactive) return;

    const viewport = emblaApi.rootNode();
    if (!viewport) return;

    const preventDrag = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const opts = { capture: true };
    const optsPassive = { capture: true, passive: false };

    viewport.addEventListener("mousedown", preventDrag, opts);
    viewport.addEventListener("touchstart", preventDrag, optsPassive);
    viewport.addEventListener("pointerdown", preventDrag, opts);

    return () => {
      viewport.removeEventListener("mousedown", preventDrag);
      viewport.removeEventListener("touchstart", preventDrag);
      viewport.removeEventListener("pointerdown", preventDrag);
    };
  }, [emblaApi, interactive]);

  const scroll = useCallback((dir: "next" | "prev") => {
    emblaApi?.[dir === "next" ? "scrollNext" : "scrollPrev"]();
    if (autoScroll) setUserInteracted(true);
  }, [emblaApi, autoScroll]);

  // Track page visibility to pause auto-scroll when tab is not active
  useEffect(() => {
    if (!autoScroll) return;

    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [autoScroll]);

  // Auto-scroll to the right every 4s
  useEffect(() => {
    if (!autoScroll || !emblaApi || !isPageVisible || isHovered || userInteracted) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [autoScroll, emblaApi, isPageVisible, isHovered, userInteracted]);

  // Reset userInteracted after 5s
  useEffect(() => {
    if (!autoScroll || !userInteracted) return;

    const timeout = setTimeout(() => setUserInteracted(false), 5000);
    return () => clearTimeout(timeout);
  }, [autoScroll, userInteracted]);

  const needsEmblaRef = interactive || showControls;
  const gradientClass = "absolute top-0 bottom-0 w-16 pointer-events-none z-10 transition-opacity duration-300";
  const buttonClass = cn(
    "cursor-pointer w-6 h-6 flex items-center justify-center bg-[#111114] group absolute top-1/2 -translate-y-1/2 z-20",
    controlsClassName
  );

  return (
    <div
      className={cn("relative touch-pan-y overflow-hidden", needsEmblaRef && "embla")}
      ref={needsEmblaRef ? emblaRef : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul className={cn("flex gap-6", needsEmblaRef && "embla__container", className)}>
        {items.map((it) => (
          <li key={it.id}>{it.node}</li>
        ))}
      </ul>

      {showControls && (
        <>
          <div className={cn(gradientClass, "left-0 bg-gradient-to-r from-zinc-950 to-transparent", canScrollPrev ? "opacity-100" : "opacity-0")} />
          <div className={cn(gradientClass, "right-0 bg-gradient-to-l from-zinc-950 to-transparent", canScrollNext ? "opacity-100" : "opacity-0")} />

          {canScrollPrev && (
            <button type="button" onClick={() => scroll("prev")} className={cn(buttonClass, "left-0")} aria-label="Previous">
              <CarouselArrowIcon direction="left" className="text-zinc-600 h-4 w-4 group-hover:text-white transition-colors" />
            </button>
          )}

          {canScrollNext && (
            <button type="button" onClick={() => scroll("next")} className={cn(buttonClass, "right-0")} aria-label="Next">
              <CarouselArrowIcon direction="right" className="text-zinc-600 h-4 w-4 group-hover:text-white transition-colors" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default memo(CarouselComponent);
