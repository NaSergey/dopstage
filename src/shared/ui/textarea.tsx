"use client";

import * as React from "react";

import { cn } from "@/shared/lib/utils/css";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  bgClassName?: string;
  height?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      disabled,
      bgClassName = "bg-black",
      height: propHeight = 96,
      onFocus,
      onBlur,
      ...props
    },
    forwardedRef,
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const composedRef = (node: HTMLTextAreaElement | null) => {
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      textareaRef.current = node;
    };

    const frameHeight = propHeight || 96;

    return (
      <div
        className={cn("relative inline-block w-full group rounded-2xl", bgClassName)}
        style={{ height: frameHeight }}
      >
        {/* Outer Glow */}
        <div
          className="absolute top-[-9px] left-[-9px] right-[-9px] bottom-[-9px] rounded-3xl bg-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-70 pointer-events-none"
          aria-hidden="true"
        />
        {/* Inner Glow */}
        <div
          className="absolute top-[-4px] left-[-4px] right-[-4px] bottom-[-4px] rounded-3xl bg-primary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-20 flex w-full h-full">
          <textarea
            ref={composedRef}
            disabled={disabled}
            data-slot="textarea"
            onFocus={onFocus}
            onBlur={onBlur}
            className={cn(
              "w-full bg-transparent border-0 outline-none text-sm resize-none",
              "px-4 py-3",
              className,
            )}
            style={{ height: frameHeight }}
            {...props}
          />
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
