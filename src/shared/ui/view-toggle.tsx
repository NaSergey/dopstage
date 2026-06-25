"use client";

import { cn } from "@/shared/lib/utils/css";
import type { ReactNode } from "react";

export interface ViewToggleOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface Props<T extends string> {
  options: ViewToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ViewToggle<T extends string>({ options, value, onChange, className }: Props<T>) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-full text-sm text-white transition-opacity",
            value === opt.value ? "opacity-100" : "opacity-50 hover:opacity-70",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
