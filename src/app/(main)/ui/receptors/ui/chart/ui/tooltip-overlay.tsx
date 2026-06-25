import { memo } from "react";
import { formatK } from "@/shared/lib/format/formatK";
import { CHART_CONFIG } from "../model/chart-config";

export interface TooltipState {
  x: number;
  y: number;
  containerWidth: number;
  items: { name: string; value: number; color: string }[];
  hoveredName: string | null;
}

const TooltipOverlay = memo(function TooltipOverlay({ tooltip }: { tooltip: TooltipState }) {
  const left = tooltip.x + CHART_CONFIG.TOOLTIP_OFFSET + CHART_CONFIG.TOOLTIP_WIDTH > tooltip.containerWidth
    ? tooltip.x - CHART_CONFIG.TOOLTIP_WIDTH - CHART_CONFIG.TOOLTIP_OFFSET
    : tooltip.x + CHART_CONFIG.TOOLTIP_OFFSET;

  return (
    <div
      className="absolute pointer-events-none z-[300] text-xs text-white [clip-path:polygon(8px_0%,calc(100%_-_8px)_0%,100%_8px,100%_calc(100%_-_8px),calc(100%_-_8px)_100%,8px_100%,0%_calc(100%_-_8px),0%_8px)] bg-zinc-800 px-3 py-2"
      style={{ left, top: tooltip.y, width: CHART_CONFIG.TOOLTIP_WIDTH, transform: "translateY(-50%)" }}
    >
      {tooltip.items.map((item) => (
        <div
          key={item.name}
          className={`flex items-center gap-1.5 leading-5 ${
            item.name === tooltip.hoveredName ? "text-white" : "text-zinc-400"
          }`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className={`truncate max-w-[100px] ${item.name === tooltip.hoveredName ? "font-semibold" : ""}`}>
            {item.name}
          </span>
          <span className="ml-auto pl-2 tabular-nums" style={{ color: item.color }}>{formatK(item.value, 2)}</span>
        </div>
      ))}
    </div>
  );
});

export default TooltipOverlay;
