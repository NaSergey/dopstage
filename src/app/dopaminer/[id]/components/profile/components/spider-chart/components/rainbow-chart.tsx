import React from "react";
import { ApiComponents } from "@/shared/api/schema";

type IRadarData = Omit<
  ApiComponents["YapperPageSpiderChartResponse"],
  "yapper_id" | "bearish" | "shitpost"
>;

interface IRadarProps {
  data: IRadarData;
  isLoading: boolean;
}

type TAnchor = "start" | "middle" | "end";

interface IMetric {
  field: keyof IRadarData;
  label: string[];
  color: string;
  dx: number;
  dy: number;
  anchor: TAnchor;
}

const METRICS: IMetric[] = [
  {
    field: "alpha_hunter",
    label: ["Alpha Hunter"],
    color: "#FF002B",
    dx: 0,
    dy: -55,
    anchor: "middle",
  },
  {
    field: "smart",
    label: ["Smart"],
    color: "#FFFF00",
    dx: 0,
    dy: -10,
    anchor: "start",
  },
  {
    field: "bullish",
    label: ["Bullish"],
    color: "#6314FF",
    dx: -60,
    dy: 25,
    anchor: "start",
  },
  {
    field: "creative",
    label: ["Creative"],
    color: "#55FF00",
    dx: 60,
    dy: 25,
    anchor: "end",
  },
  {
    field: "engagement",
    label: ["Engagement", ">5%"],
    color: "#00C0FC",
    dx: 0,
    dy: -10,
    anchor: "end",
  },
];

const RainbowRadarChart: React.FC<IRadarProps> = ({ data, isLoading }) => {
  const metricsCount = METRICS.length;
  const VB = 340;
  const center = VB / 2;
  const radius = VB / 2 - 40;
  const verticalOffset = -50;

  const normalize = (v: number): number => Math.floor(v);

  const values: number[] = METRICS.map((metric) =>
    normalize((data[metric.field])),
  );

  const getPoint = (value: number, index: number): [number, number] => {
    const angle = ((Math.PI * 2) / metricsCount) * index + Math.PI / 2;
    const r = (value / 100) * radius;
    return [
      center + r * Math.cos(angle),
      center + r * Math.sin(angle) + verticalOffset,
    ];
  };

  const fullPoint = (index: number): [number, number] => {
    const angle = ((Math.PI * 2) / metricsCount) * index + Math.PI / 2;
    return [
      center + radius * Math.cos(angle),
      center + radius * Math.sin(angle) + verticalOffset,
    ];
  };

  const polygonPoints = values
    .map((v, i) => getPoint(v, i).join(","))
    .join(" ");

  const grid = Array.from({ length: metricsCount }).map((_, level) => {
    const p = Array.from({ length: metricsCount }).map((_, i) =>
      getPoint(((level + 1) / metricsCount) * 100, i).join(","),
    );

    return (
      <polygon
        key={level}
        points={p.join(" ")}
        fill="none"
        stroke="#4E4E51"
        strokeWidth={0.8}
      />
    );
  });

  return (
    <div className="w-full h-full flex justify-center items-center relative mt-4">
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full pb-1 [@media(min-height:1100px)]:px-10"
      >
        <defs>
          <clipPath id="clipPolygon">
            <polygon points={polygonPoints} />
          </clipPath>

          {!isLoading && (
            <>
              {METRICS.map((m, i) => {
                const [vx1, vy1] = fullPoint(i);
                const [vx2, vy2] = fullPoint((i + 1) % metricsCount);

                return (
                  <React.Fragment key={i}>
                    {/* half-left */}
                    <linearGradient
                      id={`half-left-${i}`}
                      gradientUnits="userSpaceOnUse"
                      x1={center}
                      y1={center + verticalOffset}
                      x2={vx1 / 2}
                      y2={vy1 / 2}
                    >
                      <stop offset="0%" stopColor={m.color} stopOpacity={0.2} />
                    </linearGradient>

                    {/* half-right */}
                    <linearGradient
                      id={`half-right-${i - 1 < 0 ? metricsCount - 1 : i - 1}`}
                      gradientUnits="userSpaceOnUse"
                      x1={center}
                      y1={center + verticalOffset}
                      x2={vx2 / 2}
                      y2={vy2 / 2}
                    >
                      <stop offset="0%" stopColor={m.color} stopOpacity={0.2} />
                    </linearGradient>

                    {/* radial */}
                    <radialGradient
                      id={`radial-${i}`}
                      cx={vx1}
                      cy={vy1}
                      r={radius * 1.1}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor={m.color} stopOpacity={1} />
                      <stop
                        offset="35%"
                        stopColor={m.color}
                        stopOpacity={0.9}
                      />
                      <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                    </radialGradient>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </defs>

        <g>{grid}</g>

        {Array.from({ length: metricsCount }).map((_, i) => {
          const [x, y] = fullPoint(i);
          return (
            <line
              key={`radial-${i}`}
              x1={center}
              y1={center + verticalOffset}
              x2={x}
              y2={y}
              stroke="#4E4E51"
              strokeWidth={0.8}
              opacity={0.7}
            />
          );
        })}

        {Array.from({ length: 5 }).map((_, level) => {
          const t = (level + 1) / 5;
          const mid = (t + level / 5) / 2;

          const points = Array.from({ length: metricsCount })
            .map((_, i) => getPoint(mid * 100, i).join(","))
            .join(" ");

          return (
            <polygon
              key={`dashed-${level}`}
              points={points}
              fill="none"
              stroke="#3B3B3D"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.5}
            />
          );
        })}

        {!isLoading && (
          <g clipPath="url(#clipPolygon)">
            {METRICS.map((m, i) => {
              const [vx1, vy1] = fullPoint(i);
              const [vx2, vy2] = fullPoint((i + 1) % metricsCount);

              return (
                <g key={i}>
                  <polygon
                    points={`${center},${center + verticalOffset} ${vx1},${vy1} ${(vx1 + vx2) / 2
                      },${(vy1 + vy2) / 2}`}
                    fill={`url(#half-left-${i})`}
                  />

                  <polygon
                    points={`${center},${center + verticalOffset} ${(vx1 + vx2) / 2},${(vy1 + vy2) / 2
                      } ${vx2},${vy2}`}
                    fill={`url(#half-right-${i})`}
                  />

                  <circle
                    cx={vx1}
                    cy={vy1}
                    r={radius * 1.2}
                    fill={`url(#radial-${i})`}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* labels */}
        {METRICS.map((m, i) => {
          const angle = ((Math.PI * 2) / metricsCount) * i + Math.PI / 2;
          const baseDist = radius + 48;

          const baseX = center + Math.cos(angle) * baseDist;
          const baseY = center + Math.sin(angle) * baseDist;

          const lx = baseX + m.dx;
          const ly = baseY + m.dy;

          const percentValue = Math.round(values[i]);
          const percentLabel = Number.isNaN(percentValue)
            ? "--"
            : `${percentValue}%`;

          return (
            <g key={i} textAnchor={m.anchor}>
              <text
                x={lx}
                y={ly - 16}
                fontSize={18}
                fontWeight="500"
                fill={m.color}
              >
                {isLoading ? "0%" : percentLabel}
              </text>

              <text
                x={lx}
                y={ly + 4}
                fill="#6B7280"
                fontSize={15}
                fontWeight="500"
              >
                <tspan x={lx} dy="0">
                  {m.label[0]}
                </tspan>
                <tspan x={lx} dy="16">
                  {m.label[1]}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
export default RainbowRadarChart;
