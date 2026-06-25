import { ApiComponents } from "@/shared/api/schema";
import { useMemo } from "react";
import AppTooltip from "@/shared/ui/app-tooltip";

type IContributionItem =
  ApiComponents["YapperPageContributionsResponse"]["contributions"];

interface IHeatmapProps {
  data: IContributionItem;
  maxCount: number;
}

const days = ["S", "M", "T", "W", "T", "F", "S"];

function HeatmapChart({ data, maxCount }: IHeatmapProps) {
  // -------------------------------------------------------------
  // Group data by week index
  // -------------------------------------------------------------
  const weeks = useMemo(() => {
    const map = new Map<number, IContributionItem>();

    // sort input data by timestamp to keep everything chronological
    const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);

    sorted.forEach((item) => {
      const week = getWeekKey(item.timestamp);
      if (!map.has(week)) map.set(week, []);
      map.get(week)!.push(item);
    });

    // return array of weeks ordered by time
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([, weekData]) => weekData);
  }, [data]);

  // -------------------------------------------------------------
  // Compute month labels only when a NEW month starts
  // -------------------------------------------------------------
  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];

    weeks.forEach((week, idx) => {
      const ts = week[0]?.timestamp;
      if (!ts) return;

      const date = new Date(ts * 1000);
      const monthStr = date.toLocaleString("en", {
        month: "short",
        timeZone: "UTC",
      });

      // Add label only if it's the first column OR month changed
      if (
        idx === 0 ||
        monthStr !==
        new Date(weeks[idx - 1][0].timestamp * 1000).toLocaleString("en", {
          month: "short",
        })
      ) {
        labels.push({ index: idx, label: monthStr });
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className="grid grid-cols-[min-content_1fr] gap-1 w-full h-full text-[11px] xl:text-xs [@media(min-width:1820px)]:text-sm leading-none">
      {/* ---------------------------------------------------------
           Left column with weekday letters
         --------------------------------------------------------- */}
      <div className="flex flex-col justify-between mt-4 text-zinc-700 ">
        {days.map((_, d) => (
          <div key={d} className="flex-1 flex items-center">
            {_.toLowerCase()}
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------------
           Heatmap + Month labels container
         --------------------------------------------------------- */}
      <div>
        <div className="flex-1 flex flex-col w-full h-full">
          {/* ---- Month labels row ---- */}
          <div className="relative h-4 mb-1 text-zinc-700">
            {monthLabels.map((item) => (
              <div
                key={item.index}
                className="absolute text-center nowrap"
                style={{
                  left: `calc(${item.index} * (100% / ${weeks.length}))`,
                }}
              >
                <span className="">|</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* ---- Heatmap grid ---- */}
          <div className="flex flex-1 gap-1">
            {weeks.map((week, weekIndex) => {
              const normalizedWeek = week.map((item) => ({
                ...item,
                _localDay: new Date(item.timestamp * 1000).getUTCDay(),
              }));

              // find real day boundaries for this week
              const minDay = Math.min(...normalizedWeek.map((d) => d._localDay));
              const maxDay = Math.max(...normalizedWeek.map((d) => d._localDay));

              return (
                <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                  {Array.from({ length: 7 }).map((_, day) => {
                    const item = normalizedWeek.find((x) => x._localDay === day);

                    // ❗ Skip rendering circles outside real data range
                    if (day < minDay || day > maxDay) {
                      return <div key={day} className="flex-1 aspect-square" />;
                    }

                    const level = getIntensity(
                      item?.tweets_count ?? 0,
                      maxCount,
                    );

                    //  Detect if THIS cell is today
                    // const isToday =
                    //   item &&
                    //   (() => {
                    //     const d = new Date(item.timestamp * 1000);
                    //     const t = new Date();
                    //     return (
                    //       d.getFullYear() === t.getFullYear() &&
                    //       d.getMonth() === t.getMonth() &&
                    //       d.getDate() === t.getDate()
                    //     );
                    //   })();

                    return (
                      <AppTooltip
                        key={day}
                        side="top"
                        sideOffset={-5}
                        content={
                          <div className="text-xs text-zinc-900">
                            <div className="whitespace-nowrap">
                              {item ? formatDate(item.timestamp) : "No date"}
                            </div>
                            <div className="whitespace-nowrap">
                              {item?.tweets_count ?? 0} tweets
                            </div>
                          </div>
                        }
                      >
                        <div className="relative flex-1 group">
                          {/* Base cell with contribution intensity */}
                          <div
                            className="w-full h-full aspect-square mask-octagon-rotated transition-all border-3 border-transparent"
                            style={{ backgroundColor: level }}
                          />

                          {/* Hover overlay – fills the whole shape with primary (purple) color */}
                          <div
                            className="
                            pointer-events-none absolute inset-0
                            mask-octagon-rotated bg-primary/80
                            opacity-0 group-hover:opacity-100 transition-opacity
                          "
                          />
                        </div>
                      </AppTooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Convert timestamp to "week index since the beginning of year"
// -------------------------------------------------------------
function getWeekKey(timestamp: number): number {
  const d = new Date(timestamp * 1000);

  // UTC, чтобы не ловить сдвиги из-за таймзоны
  const day = d.getUTCDay(); // 0..6 (Sun..Sat)

  // начало недели (воскресенье 00:00 UTC)
  const weekStartMs = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate() - day,
    0,
    0,
    0,
    0,
  );

  return weekStartMs;
}
// -------------------------------------------------------------
// Color levels by tweets count
// -------------------------------------------------------------
function getIntensity(count: number, maxCount: number): string {
  if (count === 0) return "#27272a"; // empty cell

  const factor = count / maxCount; // 0..1 intensity

  // from → to color
  const lowColor = "#2a5d13"; // dark green
  const highColor = "#55FF00"; // bright green

  return interpolateColor(lowColor, highColor, factor);
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" });
  return `${day} ${month}`;
}

function interpolateColor(
  color1: string,
  color2: string,
  factor: number,
): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}
export default HeatmapChart;
