"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import type { ApiComponents } from "@/shared/api/schema";
import { MOCK_PROGRAMS, MOCK_PROGRAMS_POOL } from "./mock-data";

type ProgramRow = ApiComponents["ProgramsMainLeaderboardResponse"];

const MOCK_UPDATE_INTERVAL = 3000;

// Min/max rows to update per tick
const MIN_ROWS_TO_UPDATE = 3;
const MAX_ROWS_TO_UPDATE = 3;

// Fields that fluctuate each tick
const MUTABLE_FIELDS = [
  "dop_price",
  "fdv",
  "tdd",
  "total_tweets",
  "engagement",
  "reward_rate",
  "rank_change",
  "avg_dops_per_tweet",
  "avg_tweet_dop_score",
] as const;

type MutableField = (typeof MUTABLE_FIELDS)[number];

/** Returns value nudged by ±maxPct percent */
function nudge(value: number, maxPct: number): number {
  const delta = value * maxPct * (Math.random() * 2 - 1);
  return Math.max(0, value + delta);
}

function updateRow(row: ProgramRow): ProgramRow {
  // Pick a random subset of mutable fields to update (4–9 fields, or all)
  const count = 4 + Math.floor(Math.random() * (MUTABLE_FIELDS.length - 3));
  const shuffled = [...MUTABLE_FIELDS].sort(() => Math.random() - 0.5);
  const fieldsToUpdate = shuffled.slice(0, count) as MutableField[];

  const updated = { ...row };

  for (const field of fieldsToUpdate) {
    switch (field) {
      case "dop_price":
        updated.dop_price = nudge(row.dop_price, 0.03);
        // Keep fdv in sync with dop_price ratio
        updated.fdv = updated.dop_price * (row.fdv / row.dop_price);
        // Append new price to chart, keep last 7 points
        updated.daily_dop_price_chart = [
          ...row.daily_dop_price_chart.slice(-6),
          updated.dop_price,
        ];
        break;
      case "fdv":
        updated.fdv = nudge(row.fdv, 0.025);
        break;
      case "tdd":
        // tdd only grows
        updated.tdd = row.tdd + Math.floor(Math.random() * 500);
        break;
      case "total_tweets":
        // tweets only grow
        updated.total_tweets = row.total_tweets + Math.floor(Math.random() * 20);
        break;
      case "engagement":
        updated.engagement = Math.min(1, nudge(row.engagement, 0.04));
        break;
      case "reward_rate":
        updated.reward_rate = Math.min(1, nudge(row.reward_rate, 0.03));
        break;
      case "rank_change": {
        // Flip rank_change occasionally: 0, +1, -1, +2, -2
        const options = [0, 0, 1, -1, 2, -2];
        updated.rank_change = options[Math.floor(Math.random() * options.length)];
        break;
      }
      case "avg_dops_per_tweet":
        updated.avg_dops_per_tweet = nudge(row.avg_dops_per_tweet, 0.03);
        break;
      case "avg_tweet_dop_score":
        updated.avg_tweet_dop_score = nudge(row.avg_tweet_dop_score, 0.02);
        break;
    }
  }

  return updated;
}

// Probability of adding a new row from the pool on each tick (0–1)
const NEW_ROW_CHANCE = 0.25;

export function useMockLeaderboard(): ProgramRow[] {
  const [data, setData] = useState<ProgramRow[]>(() =>
    MOCK_PROGRAMS.map((row) => ({ ...row })),
  );

  // Track which pool IDs are already in the table
  const usedPoolIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => setData((prev) => {
        const next = [...prev];

        // 1. Update random existing rows
        const rowsToUpdate = Math.min(
          MIN_ROWS_TO_UPDATE + Math.floor(Math.random() * (MAX_ROWS_TO_UPDATE - MIN_ROWS_TO_UPDATE + 1)),
          next.length
        );
        const indices = [...Array(next.length).keys()]
          .sort(() => Math.random() - 0.5)
          .slice(0, rowsToUpdate);

        for (const i of indices) {
          next[i] = updateRow(next[i]);
        }

        // 2. Maybe add a new row from the pool
        if (Math.random() < NEW_ROW_CHANCE) {
          const available = MOCK_PROGRAMS_POOL.filter(
            (p) => !usedPoolIds.current.has(p.program_id),
          );
          if (available.length > 0) {
            const pick = available[Math.floor(Math.random() * available.length)];
            usedPoolIds.current.add(pick.program_id);
            // Assign rank = last position + 1
            const newRow: ProgramRow = {
              ...pick,
              rank: next.length + 1,
              rank_change: 0,
            };
            next.push(newRow);
          }
        }

        return next;
      }));
    }, MOCK_UPDATE_INTERVAL);

    return () => clearInterval(id);
  }, []);

  return data;
}
