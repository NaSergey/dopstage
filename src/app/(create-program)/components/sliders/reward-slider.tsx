"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/css";

interface RewardSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onChangeComplete?: (value: number) => void; // Called when dragging ends
  className?: string;
  step?: number;
  suffix?: string;
}

export function RewardSlider({
  value,
  min = 0,
  max = 100,
  onChange,
  onChangeComplete,
  className,
  step = 1,
  suffix = "%",
}: RewardSliderProps) {
  // Local state for smooth dragging without triggering parent updates
  const [isDragging, setIsDragging] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastUpdateRef = React.useRef<number>(0);

  // Sync local value with prop value when not dragging
  React.useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const displayValue = isDragging ? localValue : value;
  const percentage = ((displayValue - min) / (max - min)) * 100;

  const calculateValue = React.useCallback((clientX: number) => {
    if (!sliderRef.current) return null;
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const width = rect.width;
    
    // Calculate the new value based on mouse position
    let newValue = min + (offsetX / width) * (max - min);
    
    // Clamp the value to min/max
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Snap to the nearest step
    newValue = Math.round(newValue / step) * step;
    
    return newValue;
  }, [min, max, step]);

  // Stable wrapper ref: handleMouseUp is used in removeEventListener inside its own callback,
  // which causes "accessed before declaration" (react-hooks/immutability). A ref + stable
  // callback ensures we add/remove the same listener reference.
  const handleMouseUpRef = React.useRef<() => void>(() => {});
  const stableMouseUp = React.useCallback(() => handleMouseUpRef.current?.(), []);

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      // Cancel any pending RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use RAF for smooth visual updates
      rafRef.current = requestAnimationFrame(() => {
        const newValue = calculateValue(event.clientX);
        if (newValue === null || newValue === localValue) return;
        
        // Update local state immediately for smooth UI
        setLocalValue(newValue);
        
        // Throttle parent updates to every 50ms
        const now = Date.now();
        if (now - lastUpdateRef.current > 50) {
          onChange(newValue);
          lastUpdateRef.current = now;
        }
      });
    },
    [calculateValue, localValue, onChange]
  );

  const handleMouseUp = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    setIsDragging(false);
    
    // Ensure final value is committed
    if (localValue !== value) {
      onChange(localValue);
    }
    
    // Trigger immediate save callback
    onChangeComplete?.(localValue);
    
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", stableMouseUp);
  }, [handleMouseMove, localValue, value, onChange, onChangeComplete, stableMouseUp]);

  // Update ref in effect to avoid react-hooks/refs (no ref access during render).
  React.useEffect(() => {
    handleMouseUpRef.current = handleMouseUp;
  });

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stableMouseUp);
    
    // Trigger initial calculation
    const newValue = calculateValue(event.clientX);
    if (newValue !== null) {
      setLocalValue(newValue);
      onChange(newValue);
      lastUpdateRef.current = Date.now();
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Labels (top) */}
      <div className="relative flex items-center justify-between text-xs text-zinc-500 h-8">
        <span>min</span>
        <div 
          className="absolute bg-zinc-950 border border-white px-2 py-1 text-zinc-50 pointer-events-none whitespace-nowrap"
          style={{ 
            left: `clamp(18px, ${percentage}%, calc(100% - 24px))`,
            transform: "translateX(-50%)",
          }}
        >
          {displayValue} {suffix}
        </div>
        <span>
          {suffix === "%" ? `100 % of the pool` : `${max}${suffix} max`}
        </span>
      </div>

      {/* Slider */}
      <div 
        ref={sliderRef}
        className="relative h-8 select-none cursor-pointer "
        onMouseDown={handleMouseDown}
      >
        {/* Static striped track */}
        <div
          className="absolute inset-0 rounded overflow-hidden pointer-events-none"
          style={{
            backgroundColor: "#0a0a0a",
            backgroundImage: `repeating-linear-gradient(90deg,
              rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, #0a0a0a 1px, #0a0a0a 5px,
              rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px, #0a0a0a 6px, #0a0a0a 10px,
              rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px, #0a0a0a 11px, #0a0a0a 15px,
              rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 16px, #0a0a0a 16px, #0a0a0a 20px,
              rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px, #0a0a0a 21px, #0a0a0a 25px,
              rgba(255,255,255,0.05) 25px, rgba(255,255,255,0.05) 26px, #0a0a0a 26px, #0a0a0a 30px,
              rgba(255,255,255,0.05) 30px, rgba(255,255,255,0.05) 31px, #0a0a0a 31px, #0a0a0a 35px,
              rgba(255,255,255,0.05) 35px, rgba(255,255,255,0.05) 36px, #0a0a0a 36px, #0a0a0a 40px,
              rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px, #0a0a0a 41px, #0a0a0a 45px,
              rgba(255,255,255,0.05) 45px, rgba(255,255,255,0.05) 46px, #0a0a0a 46px, #0a0a0a 50px,
              rgba(255,255,255,0.05) 50px, rgba(255,255,255,0.05) 51px, #0a0a0a 51px, #0a0a0a 55px,
              rgba(255,255,255,0.05) 55px, rgba(255,255,255,0.05) 56px, #0a0a0a 56px, #0a0a0a 60px,
              rgba(255,255,255,0.05) 60px, rgba(255,255,255,0.05) 61px, #0a0a0a 61px, #0a0a0a 65px,
              rgba(255,255,255,0.05) 65px, rgba(255,255,255,0.05) 66px, #0a0a0a 66px, #0a0a0a 70px,
              rgba(255,255,255,0.05) 70px, rgba(255,255,255,0.05) 71px, #0a0a0a 71px, #0a0a0a 75px,
              rgba(255,255,255,0.05) 75px, rgba(255,255,255,0.05) 76px, #0a0a0a 76px, #0a0a0a 80px,
              rgba(255,255,255,0.05) 80px, rgba(255,255,255,0.05) 81px, #0a0a0a 81px, #0a0a0a 85px,
              rgba(255,255,255,0.05) 85px, rgba(255,255,255,0.05) 86px, #0a0a0a 86px, #0a0a0a 90px,
              rgba(255,255,255,0.05) 90px, rgba(255,255,255,0.05) 96px, #0a0a0a 96px, #0a0a0a 100px
            )`,
            backgroundAttachment: "fixed",
          }}
        />

        {/* Filled overlay */}
        <div
          className="absolute inset-y-0 left-0 bg-primary pointer-events-none"
          style={{ width: `${percentage}%` }}
        />

        {/* Visual handle (non-interactive) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-primary z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `clamp(0px, calc(${percentage}% - 16px), calc(100% - 32px))` }}
          role="presentation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path d="M10.1536 2.1875L12.3147 5.16113V8.83789L10.1536 11.8115L6.65747 12.9482L3.1604 11.8115L1.00024 8.83789V5.16113L3.1604 2.1875L6.65747 1.05078L10.1536 2.1875Z" stroke="black" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default RewardSlider;
