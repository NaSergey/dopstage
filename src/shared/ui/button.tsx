"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils/css";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { FrameSurface } from "@/shared/ui/frame-surface";

const buttonBaseStyles = [
  "inline-flex items-center justify-center gap-2",
  "whitespace-nowrap rounded-2xl text-sm font-medium",
  "transition-all duration-200 ease-in-out",
  "cursor-pointer",
  "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
].join(" ");

const isFrameVariant = (v: string | null | undefined) =>
  v === "frame" ||
  v === "frame-gray" ||
  v === "frame-hover-glow" ||
  v === "frame-hover-fire";

const buttonVariants = cva(buttonBaseStyles, {
  variants: {
    variant: {
      frame: "group relative bg-transparent border-0 p-0 inline-block",
      "frame-gray": "group relative bg-transparent border-0 p-0 inline-block",
      "frame-hover-glow":
        "group relative bg-transparent border-0 p-0 inline-block",
      "frame-hover-fire":
        "group relative bg-transparent border-0 p-0 inline-block overflow-hidden",
    },
    size: {
      default: "h-10 px-8 py-2.5 has-[>svg]:px-3",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "frame",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  frameHeight?: number;
  frameColor?: string;
  frameFillColor?: string;
  inset?: number;
}

const Video = ({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <video
    src={src}
    autoPlay
    loop
    muted
    playsInline
    className={className}
    style={style}
    aria-hidden="true"
  />
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "frame-hover-fire",
      size,
      asChild = false,
      frameHeight = 40,
      frameColor = "#6314FF",
      frameFillColor = "#6314FF",
      inset,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const internalRef = React.useRef<HTMLButtonElement>(null);
    const composedRefs = useComposedRefs(ref, internalRef);

    if (isFrameVariant(variant)) {
      const isGray = variant === "frame-gray";
      const isGlow = variant === "frame-hover-glow";
      const isFire = variant === "frame-hover-fire";
      const isAnimated = isGlow || isFire;
      const calculatedInset = frameHeight <= 24 ? Math.round(frameHeight * 0.38) : 14;
      const finalInset = inset ?? calculatedInset;

      return (
        <Comp
          ref={composedRefs}
          className={cn(buttonVariants({ variant, size, className }))}
          style={{ height: frameHeight }}
          {...props}
        >
          <FrameSurface
            height={frameHeight}
            inset={finalInset}
            strokeColor={isGray ? "#52525B" : frameColor}
            pathClassName={
              isGray
                ? "transition-colors group-hover:stroke-[#6314FF]"
                : isAnimated
                  ? "transition-opacity group-hover:opacity-0"
                  : ""
            }
            contentElement={null}
            className="absolute inset-0 w-full"
            renderUnderlay={(context) => (
              <>
                {/* Base filled background for animated variants */}
                {isAnimated && (
                  <div
                    className="absolute inset-0 bg-[#6314FF]"
                    style={context.clipPathStyle}
                    aria-hidden="true"
                  />
                )}

                {(variant === "frame" ||
                  variant === "frame-gray" ||
                  isGlow) && (
                    <>
                      {isGlow ? (
                        /* Background glow effect video - extends beyond button borders */
                        <div className="absolute top-[-5px] left-[-5px] right-[-5px] bottom-[-5px] rounded-full overflow-hidden opacity-0 transition-opacity group-hover:opacity-40 group-active:opacity-0 pointer-events-none">
                          <Video
                            src="/hover-button.webm"
                            className="absolute inset-0 w-full h-full"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <>
                          <div
                            className="absolute top-[-8px] left-[-8px] right-[-8px] bottom-[-8px] rounded-full bg-primary/30 opacity-0 transition-opacity group-hover:opacity-70"
                            aria-hidden="true"
                          />
                          <div
                            className="absolute top-[-3px] left-[-3px] right-[-3px] bottom-[-3px] rounded-full bg-primary/50 opacity-0 transition-opacity group-hover:opacity-80"
                            aria-hidden="true"
                          />
                        </>
                      )}
                      {(variant === "frame" || variant === "frame-gray") && (
                        <div
                          className="absolute top-0 left-0 right-0 bottom-0 bg-black rounded-full opacity-0 transition-all group-hover:opacity-100 group-active:bg-white group-active:opacity-100"
                          style={context.clipPathStyle}
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
              </>
            )}
            renderSvg={({ defaultRender, width }) => (
              <>
                <svg
                  width={width}
                  height={frameHeight}
                  viewBox={`0 0 ${width} ${frameHeight}`}
                  fill="none"
                  className="absolute top-0 left-0"
                  style={{ width, height: frameHeight }}
                  aria-hidden="true"
                >
                  {isFire && (
                    <path
                      d={`M19 0.5 L${width - 19} 0.5 L${width - 7.5} 4.25 L${width - 0.5} 14 V${frameHeight - 14} L${width - 7.5} ${frameHeight - 4.25} L${width - 19} ${frameHeight - 0.5} H19 L7.5 ${frameHeight - 4.25} L0.5 ${frameHeight - 14} V14 L7.5 4.25 Z`}
                      fill={frameFillColor}
                      className="transition-opacity group-hover:opacity-0"
                    />
                  )}
                </svg>
                {defaultRender()}
              </>
            )}
            renderAfterContent={(context) => (
              <>
                {/* Inner effect video - clipped to frame shape */}
                {isGlow && (
                  <Video
                    src="/hover-button.webm"
                    className="absolute top-0 left-0 right-0 bottom-0 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-0"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      ...context.clipPathStyle,
                    }}
                  />
                )}
                {isFire && (
                  <Video
                    src="/hover-button-m.webm"
                    className="absolute top-0 left-0 h-auto w-full opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-0"
                    style={context.clipPathStyle}
                  />
                )}
                {isAnimated && (
                  <div
                    className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-0 transition-opacity group-active:opacity-100"
                    style={context.clipPathStyle}
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          >
            <span
              className={cn(
                "relative z-10 flex items-center justify-center w-full h-full text-foreground transition-colors",
                isAnimated
                  ? "group-hover:text-white group-active:text-black"
                  : "group-hover:text-primary group-active:text-black",
              )}
            >
              {props.children}
            </span>
          </FrameSurface>
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };