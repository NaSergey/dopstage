import * as React from "react";
import { cn } from "../lib/utils/css";

export interface OctagonFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  frameColor?: string;
  bgColor?: string;
  strokeWidth?: number;
  children?: React.ReactNode;
  contentClassName?: string;
}

const CORNER_X = 3.92453;
const CORNER_Y = 4;

export const OctagonFrame = React.forwardRef<HTMLDivElement, OctagonFrameProps>(
  ({ width, height, frameColor, bgColor = "#6314FF", strokeWidth = 1.6, children, contentClassName, className, style, ...rest }, ref) => {
    const offset = strokeWidth / 2;
    const clipPathId = React.useId();
    
    const pathData = `M${offset} ${CORNER_Y} L${CORNER_X} ${offset} H${width - CORNER_X} L${width - offset} ${CORNER_Y} V${height - CORNER_Y} L${width - CORNER_X} ${height - offset} H${CORNER_X} L${offset} ${height - CORNER_Y} V${CORNER_Y} Z`;

    return (
      <div ref={ref} className={cn("relative inline-block", className)} style={{ width, height, ...style }} {...rest}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" className="absolute inset-0 z-20" aria-hidden>
          <defs>
            <clipPath id={clipPathId}>
              <path d={pathData} />
            </clipPath>
          </defs>
          <path d={pathData} fill={bgColor} stroke={frameColor} strokeWidth={strokeWidth} />
        </svg>
        {children && (
          <div
            className={cn("relative z-10 w-full h-full flex items-center justify-center", contentClassName)}
            style={{ clipPath: `url(#${clipPathId})`, WebkitClipPath: `url(#${clipPathId})` }}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

OctagonFrame.displayName = "OctagonFrame";

