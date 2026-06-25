"use client";

import { useState, useRef, useEffect } from "react";

export type CellAnimKeys = Map<number, Map<string, number>>;

export interface TableChanges {
  changedCells: CellAnimKeys;
  newRowIndices: Set<number>;
}

const ANIM_CLEAR_MS = 2000;

const EMPTY: TableChanges = { changedCells: new Map(), newRowIndices: new Set() };

export function useTableChanges<T extends Record<string, unknown>>(
  data: T[],
): TableChanges {
  const [tableChanges, setTableChanges] = useState<TableChanges>(EMPTY);

  const prevRef = useRef<T[]>([]);
  const animKeysRef = useRef<Map<number, Map<string, number>>>(new Map());

  useEffect(() => {
    const prev = prevRef.current;
    const changedCells: CellAnimKeys = new Map();
    const newRowIndices = new Set<number>();

    for (let i = 0; i < data.length; i++) {
      const curr = data[i];

      if (i >= prev.length) {
        newRowIndices.add(i);
        continue;
      }

      const prevRow = prev[i];
      const changedFields: string[] = [];

      for (const key of Object.keys(curr)) {
        const cv = curr[key];
        const pv = prevRow[key];
        if (Array.isArray(cv) || Array.isArray(pv)) continue;
        if (cv !== pv) changedFields.push(key);
      }

      if (changedFields.length === 0) continue;

      const rowKeys = animKeysRef.current.get(i) ?? new Map<string, number>();
      const fieldMap = new Map<string, number>();

      for (const field of changedFields) {
        const next = (rowKeys.get(field) ?? 0) + 1;
        rowKeys.set(field, next);
        fieldMap.set(field, next);
      }

      animKeysRef.current.set(i, rowKeys);
      changedCells.set(i, fieldMap);
    }

    const wasEmpty = prev.length === 0;
    prevRef.current = data.map((row) => ({ ...row }));

    // Clean up animKeys for rows that no longer exist
    for (const key of animKeysRef.current.keys()) {
      if (key >= data.length) animKeysRef.current.delete(key);
    }

    // Skip animations on initial data load (e.g. after skeletons)
    if (wasEmpty) return;

    if (changedCells.size === 0 && newRowIndices.size === 0) return;

    const startTimer = setTimeout(() => {
      setTableChanges({ changedCells, newRowIndices });
    }, 0);

    const clearTimer = setTimeout(() => {
      setTableChanges(EMPTY);
    }, ANIM_CLEAR_MS);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(clearTimer);
    };
  }, [data]);

  return tableChanges;
}
