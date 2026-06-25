import { useCallback, useEffect, useRef, useState } from "react";
import type { ISeriesApi } from "lightweight-charts";
import type { OthersSummary, ReceptorSeriesData } from "../model/types";
import { getImageSrc } from "../lib/utils";
import { formatK } from "@/shared/lib/format/formatK";
import type { LabelsOverlayItem } from "../ui/labels-overlay";

type Args = {
  seriesByIdRef: React.RefObject<Map<string, ISeriesApi<"Line">>>;
  hoveredSeriesIdRef: React.RefObject<string | null>;
  selectedReceptorId: string | null;
  data: ReceptorSeriesData[];
  othersSummary: OthersSummary;
};

export function useLabelsOverlay({
  seriesByIdRef,
  hoveredSeriesIdRef,
  selectedReceptorId,
  data,
  othersSummary,
}: Args) {
  const rafIdRef = useRef<number | null>(null);
  const [items, setItems] = useState<LabelsOverlayItem[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const updateNow = useCallback(() => {
    const nextHoveredId = hoveredSeriesIdRef.current;
    setHoveredId(nextHoveredId);

    const nextItems: LabelsOverlayItem[] = [];

    for (const receptor of data) {
      if (receptor.showLabel === false) continue;

      const series = seriesByIdRef.current.get(receptor.id);
      if (!series) continue;

      const last = series.lastValueData(true);
      const price =
        last && "price" in last && typeof last.price === "number"
          ? last.price
          : null;

      if (price == null) continue;

      const y = series.priceToCoordinate(price);
      if (typeof y !== "number") continue;

      nextItems.push({
        id: receptor.id,
        top: y,
        name: receptor.name,
        subtitle: `TDD ${formatK(receptor.tdd ?? 0)}`,
        imageSrc: getImageSrc(receptor.image_url),
        showIcon: true,
        color: receptor.color,
      });
    }

    if (othersSummary && nextHoveredId === othersSummary.id) {
      const series = seriesByIdRef.current.get(othersSummary.id);
      const meta = data.find((d) => d.id === othersSummary.id);

      if (series && meta) {
        const last = series.lastValueData(true);
        const price =
          last && "price" in last && typeof last.price === "number"
            ? last.price
            : null;

        if (price != null) {
          const y = series.priceToCoordinate(price);
          if (typeof y === "number") {
            nextItems.push({
              id: meta.id,
              top: y,
              name: `The other ${othersSummary.receptorsCount} subnets`,
              subtitle: `Summary TDD ${formatK(othersSummary.accTdd)}`,
              imageSrc: getImageSrc(meta.image_url),
              showIcon: false,
              color: meta.color,
            });
          }
        }
      }
    }

    setItems(nextItems);
  }, [data, hoveredSeriesIdRef, seriesByIdRef, othersSummary]);

  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      updateNow();
    });
  }, [updateNow]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    // ensure at least one calculation after mount / data changes
    scheduleUpdate();
  }, [scheduleUpdate, data, selectedReceptorId]);

  return { scheduleUpdate, items, hoveredId };
}
