import React, { useState, useRef, useMemo } from "react";
import { cn } from "@/shared/lib/utils/css";
import { getSparklineValues, isDataPoint } from "@/shared/ui/sparkline/sparkline-data";
import { SparklineTooltip } from "./sparkline-tooltip";
import type { SparklineHoverInfo, SparklineData } from "./types";

const SPARKLINE_COLOR_GAIN = "#55FF00"; // green when value goes up
const SPARKLINE_COLOR_LOSS = "#FF002B"; // red when value goes down

interface ISparklineProps {
  data: SparklineData;
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  min?: number;
  max?: number;
  className?: string;
  paddingX?: number;
  paddingY?: number;
  interactive?: boolean;
}

function Sparkline({
  data,
  className,
  width = 100,
  height = 36,
  strokeWidth = 2,
  stroke,
  fill = null,
  paddingX = 4,
  paddingY = 4,
  min,
  max,
  interactive = false,
}: ISparklineProps) {
  const [hoverInfo, setHoverInfo] = useState<SparklineHoverInfo>(null);
  const [exiting, setExiting] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const values = useMemo(() => getSparklineValues(data), [data]);

  if (data.length < 2) return null;

  const pointCount = values.length;
  const minValue = min ?? Math.min(...values);
  const maxValue = max ?? Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const lastValue = values[pointCount - 1];
  const prevValue = values[pointCount - 2];
  const strokeColor =
    stroke ?? (lastValue >= prevValue ? SPARKLINE_COLOR_GAIN : SPARKLINE_COLOR_LOSS);

  const scaleX = (index: number) =>
    paddingX + (index / (pointCount - 1)) * innerWidth;

  const scaleY = (value: number) =>
    paddingY + innerHeight - ((value - minValue) / valueRange) * innerHeight;

  const pathD = values
    .map((value, index) => `${index === 0 ? "M" : "L"}${scaleX(index)},${scaleY(value)}`)
    .join(" ");

  const handlePointerMove = (
    e: React.PointerEvent<SVGSVGElement>,
  ) => {
    if (!interactive) return;

    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
      setExiting(false);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const xInViewBox = xRatio * width;

    let index = Math.round(
      ((xInViewBox - paddingX) / innerWidth) * (pointCount - 1),
    );
    index = Math.max(0, Math.min(pointCount - 1, index));

    if (hoverInfo?.index === index) return;

    const tX = rect.left + (scaleX(index) / width) * rect.width;
    const tY = rect.top + (scaleY(values[index]) / height) * rect.height;

    setHoverInfo({ index, x: tX, y: tY });
  };

  const handlePointerLeave = () => {
    if (!interactive) return;
    setExiting(true);
    exitTimeoutRef.current = setTimeout(() => {
      setHoverInfo(null);
      setExiting(false);
      exitTimeoutRef.current = null;
    }, 200); // tooltip exit animation duration
  };

  return (
    <>
      <svg
        className={cn("w-full h-full overflow-visible", className)}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerLeave={interactive ? handlePointerLeave : undefined}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          touchAction: "none",
        }}
      >
        {fill && (
          <path
            d={`M${paddingX},${paddingY + innerHeight} ${pathD} L${paddingX + innerWidth},${paddingY + innerHeight} Z`}
            fill={fill}
            style={{ pointerEvents: "none" }}
          />
        )}

        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pointerEvents: "none",
          }}
        />

        {interactive && hoverInfo && (
          <circle
            cx={scaleX(hoverInfo.index)}
            cy={scaleY(values[hoverInfo.index])}
            r={0.8}
            fill={strokeColor}
            stroke="white"
            strokeWidth={0.5}
            style={{ pointerEvents: "none" }}
          />
        )}

        <rect
          width={width}
          height={height}
          fill="rgba(0,0,0,0)"
          style={{ pointerEvents: "all" }}
        />
      </svg>

      <SparklineTooltip
        info={hoverInfo}
        data={data}
        values={values}
        hasDateLabel={data.length > 0 && isDataPoint(data[0])}
        visible={!!hoverInfo}
        exiting={exiting}
      />
    </>
  );
}

export default Sparkline;