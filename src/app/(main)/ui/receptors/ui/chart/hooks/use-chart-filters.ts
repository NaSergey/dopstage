import { useState, useCallback, useMemo } from "react";
import { OthersSummary, ReceptorSeriesData } from "../model/types";
import type { Time } from "lightweight-charts";

export const daysCountOptions = [
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
  { value: "180", label: "All Time" },
] as const;

export const receptorsCountOptions = [
  { value: "1", label: "Top 1" },
  { value: "10", label: "Top 10" },
  { value: "30", label: "Top 30" },
  { value: "120", label: "All Subnets" },
] as const;

const OTHERS_ID = "others";

type DaysCount = (typeof daysCountOptions)[number]["value"];
type ReceptorsCount = (typeof receptorsCountOptions)[number]["value"];

export function useChartFilters(data: ReceptorSeriesData[]) {
  const [selectedReceptorsCount, setSelectedReceptorsCount] =
    useState<ReceptorsCount>(receptorsCountOptions[0].value);
  const [selectedDaysCount, setSelectedDaysCount] = useState<DaysCount>(
    daysCountOptions[2].value,
  );

  const onReceptorsCountChange = useCallback((value: ReceptorsCount) => {
    setSelectedReceptorsCount(value);
  }, []);

  const onDaysCountChange = useCallback((value: DaysCount) => {
    setSelectedDaysCount(value);
  }, []);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aLast = a.data[a.data.length - 1]?.value ?? 0;
      const bLast = b.data[b.data.length - 1]?.value ?? 0;
      return bLast - aLast;
    });
  }, [data]);


  const { updatedReceptorsCountData, othersSummary } = useMemo(() => {
    const count = Number(selectedReceptorsCount);

    const topSeries = sortedData.slice(0, count).map((s, i) =>
      i === 0 ? { ...s, color: "#6314FF" } : s,
    );
    const otherSeriesCandidates = sortedData.slice(count);
    if (otherSeriesCandidates.length === 0) {
      return { updatedReceptorsCountData: topSeries, othersSummary: null as OthersSummary };
    }

    const othersCount = otherSeriesCandidates.length;
    const accTdd = otherSeriesCandidates.reduce(
      (acc, s) => acc + (s.tdd ?? 0),
      0,
    );


    const sumByTimestamp = new Map<number, number>();
    for (const s of otherSeriesCandidates) {
      for (const p of s.data) {
        const t = Number(p.time);
        const v = p.value;
        sumByTimestamp.set(t, (sumByTimestamp.get(t) ?? 0) + v);
      }
    }

    const othersData = Array.from(sumByTimestamp.entries())
      .sort(([t1], [t2]) => t1 - t2)
      .map(([time, value]) => ({ time: time as Time, value: value }));

    const othersSeries: ReceptorSeriesData = {
      id: OTHERS_ID,
      name: "Others",
      image_url: null,
      tdd: 0,
      color: "#6B7280",
      data: othersData,
      stackOrder: -1,
      showLabel: false,
      isSelectable: false,
    };

    const nextOthersSummary: OthersSummary = {
      id: OTHERS_ID,
      receptorsCount: othersCount,
      accTdd,
    };

    return {
      updatedReceptorsCountData: [...topSeries, othersSeries],
      othersSummary: nextOthersSummary,
    };
  }, [sortedData, selectedReceptorsCount]);

  const updatedDaysCountData = useMemo(() => {
    return updatedReceptorsCountData.map((item) => ({
      ...item,
      data: item.data.slice(
        item.data.length - Number(selectedDaysCount),
        item.data.length,
      ),
    }));
  }, [updatedReceptorsCountData, selectedDaysCount]);

  return {
    chartData: updatedDaysCountData,
    othersSummary,
    selectedReceptorsCount,
    selectedDaysCount,
    onReceptorsCountChange,
    onDaysCountChange,
  };
}
