import * as React from "react";
import { useComposedRefs } from "@radix-ui/react-compose-refs";

import {
  getFrameGeometry,
  type FrameGeometryMode,
  type FrameGeometryResult,
  type FrameSegmentKey,
} from "../lib/utils/frame-geometry";
import { cn } from "../lib/utils/css";

type StrokeColorProp =
  | string
  | ((context: FrameSurfaceContext) => string | undefined);

type SegmentStrokeCaps = Partial<
  Record<FrameSegmentKey, React.SVGAttributes<SVGPathElement>["strokeLinecap"]>
>;

export interface FrameSurfaceContext {
  geometry: FrameGeometryResult;
  clipPathId: string;
  clipPathStyle?: React.CSSProperties;
  width: number;
  height: number;
  isHovered: boolean;
}

export interface FrameSurfaceProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  height: number;
  inset?: number;
  bottomLineOffset?: number;
  mode?: FrameGeometryMode;
  strokeColor?: StrokeColorProp;
  pathClassName?: string;
  segmentStrokeCaps?: SegmentStrokeCaps;
  renderUnderlay?: (context: FrameSurfaceContext) => React.ReactNode;
  renderBeforeContent?: (context: FrameSurfaceContext) => React.ReactNode;
  renderAfterContent?: (context: FrameSurfaceContext) => React.ReactNode;
  renderSvg?: (
    context: FrameSurfaceContext & { defaultRender: () => React.ReactNode },
  ) => React.ReactNode;
  contentClassName?: string;
  contentElement?: React.ElementType | null;
  children?:
    | React.ReactNode
    | ((context: FrameSurfaceContext) => React.ReactNode);
}

const SEGMENT_ORDER: FrameSegmentKey[] = [
  "topRight",
  "bottomRight",
  "right",
  "topLeft",
  "bottomLeft",
  "left",
  "top",
  "bottom",
];

const DEFAULT_STROKE_CAP: React.SVGAttributes<SVGPathElement>["strokeLinecap"] =
  "round";

export const FrameSurface = React.forwardRef<HTMLDivElement, FrameSurfaceProps>(
  (
    {
      height,
      inset = 14,
      bottomLineOffset = 0,
      mode = "closed",
      strokeColor,
      pathClassName,
      segmentStrokeCaps,
      renderUnderlay,
      renderBeforeContent,
      renderAfterContent,
      renderSvg,
      contentClassName,
      contentElement = "div",
      children,
      className,
      onMouseEnter,
      onMouseLeave,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, containerRef);

    const [width, setWidth] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const clipPathId = React.useId();

    React.useLayoutEffect(() => {
      const element = containerRef.current;
      if (!element) return undefined;

      const updateSize = () => {
        setWidth(element.offsetWidth);
      };

      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(element);

      updateSize();

      return () => resizeObserver.disconnect();
    }, [height]);

    const geometry = React.useMemo(
      () =>
        getFrameGeometry({
          width,
          height,
          inset,
          bottomLineOffset,
          mode,
        }),
      [width, height, inset, bottomLineOffset, mode],
    );

    const clipPathStyle = React.useMemo(
      () =>
        geometry.hasGeometry
          ? {
              clipPath: `url(#${clipPathId})`,
              WebkitClipPath: `url(#${clipPathId})`,
            }
          : undefined,
      [geometry.hasGeometry, clipPathId],
    );

    const context: FrameSurfaceContext = React.useMemo(
      () => ({
        geometry,
        clipPathId,
        clipPathStyle,
        width,
        height,
        isHovered,
      }),
      [geometry, clipPathId, clipPathStyle, width, height, isHovered],
    );

    const resolvedStrokeColor =
      typeof strokeColor === "function"
        ? strokeColor(context)
        : strokeColor ?? "#000000";

    const defaultSvg = React.useMemo(() => {
      if (!geometry.hasGeometry || width <= 0) {
        return null;
      }

      return (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          className="absolute top-0 left-0 z-10 pointer-events-none"
          style={{ width, height }}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipPathId}>
              <path d={geometry.clipPath} />
            </clipPath>
          </defs>
          {SEGMENT_ORDER.map((segmentKey) => {
            const d = geometry.outlineSegments[segmentKey];
            if (!d) return null;

            return (
              <path
                key={segmentKey}
                d={d}
                stroke={resolvedStrokeColor}
                className={pathClassName}
                strokeLinecap={
                  segmentStrokeCaps?.[segmentKey] ?? DEFAULT_STROKE_CAP
                }
              />
            );
          })}
        </svg>
      );
    }, [
      geometry.hasGeometry,
      geometry.clipPath,
      geometry.outlineSegments,
      height,
      width,
      clipPathId,
      pathClassName,
      resolvedStrokeColor,
      segmentStrokeCaps,
    ]);

    const mergedStyle = React.useMemo(
      () => ({
        ...style,
        height,
      }),
      [style, height],
    );

    const handleMouseEnter = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseEnter?.(event);
        setIsHovered(true);
      },
      [onMouseEnter],
    );

    const handleMouseLeave = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseLeave?.(event);
        setIsHovered(false);
      },
      [onMouseLeave],
    );

    const content =
      typeof children === "function" ? children(context) : children;

    const renderedContent =
      contentElement === null
        ? content
        : React.createElement(
            contentElement,
            {
              className: cn("relative z-20", contentClassName),
            },
            content,
          );

    return (
      <div
        ref={composedRef}
        className={className}
        style={mergedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {renderUnderlay?.(context)}
        {renderSvg
          ? renderSvg({ ...context, defaultRender: () => defaultSvg })
          : defaultSvg}
        {renderBeforeContent?.(context)}
        {renderedContent}
        {renderAfterContent?.(context)}
      </div>
    );
  },
);

FrameSurface.displayName = "FrameSurface";

