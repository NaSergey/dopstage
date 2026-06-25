"use client";

import { useMemo, useSyncExternalStore } from "react";
import getTimeAgo from "@/shared/lib/format/getTimeAgo";
import { cn } from "@/shared/lib/utils/css";

// Singleton store - manages all timers without React context
const store = (() => {
  const listeners = new Map<number, Set<() => void>>();
  const cache = new Map<number, string>();
  // Tracks unique timestamps that are currently < 60s old — O(1) hasRecentTimestamp
  const recentTimestamps = new Set<number>();
  let secondInterval: ReturnType<typeof setInterval> | null = null;
  let minuteInterval: ReturnType<typeof setInterval> | null = null;

  function toMs(ts: number) { return ts < 1e12 ? ts * 1000 : ts; }

  // Recalculates all values and invokes callbacks only if value changed
  function tick() {
    listeners.forEach((cbs, ts) => {
      const next = getTimeAgo(ts);
      if (next !== cache.get(ts)) {
        cache.set(ts, next);
        cbs.forEach(cb => cb());
      }
    });
  }

  // Evicts timestamps that have aged past 60s from recentTimestamps
  function pruneRecent() {
    for (const ts of recentTimestamps) {
      if (Date.now() - toMs(ts) >= 60_000) recentTimestamps.delete(ts);
    }
  }

  // Starts intervals (1 second if recent items exist; always 1 minute)
  function startIntervals() {
    if (recentTimestamps.size > 0 && !secondInterval) {
      secondInterval = setInterval(() => {
        tick();
        pruneRecent();
        if (recentTimestamps.size === 0) {
          clearInterval(secondInterval!);
          secondInterval = null;
        }
      }, 1_000);
    }

    if (!minuteInterval) {
      minuteInterval = setInterval(tick, 60_000);
    }
  }

  // Clears both intervals when there are no more listeners
  function stopIntervals() {
    if (secondInterval) { clearInterval(secondInterval); secondInterval = null; }
    if (minuteInterval) { clearInterval(minuteInterval); minuteInterval = null; }
  }

  return {
    // Register component for specific timestamp updates
    subscribe(timestamp: number, cb: () => void) {
      if (!listeners.has(timestamp)) {
        listeners.set(timestamp, new Set());
        cache.set(timestamp, getTimeAgo(timestamp));
        if (Date.now() - toMs(timestamp) < 60_000) recentTimestamps.add(timestamp);
      }
      listeners.get(timestamp)!.add(cb);
      startIntervals();

      return () => {
        listeners.get(timestamp)!.delete(cb);
        if (!listeners.get(timestamp)!.size) {
          listeners.delete(timestamp);
          cache.delete(timestamp);
          recentTimestamps.delete(timestamp);
        }
        if (!listeners.size) stopIntervals();
      };
    },

    // Get current cached value for timestamp
    getSnapshot(timestamp: number): string {
      return cache.get(timestamp) ?? getTimeAgo(timestamp);
    },
  };
})();

interface TimeAgoLiveProps {
  timestamp: number;
  className?: string;
  title?: string;
}

// Component that displays "X minutes ago" with automatic updates
export function TimeAgoLive({ timestamp, className, title }: TimeAgoLiveProps) {
  const subscribe = useMemo(() => (cb: () => void) => store.subscribe(timestamp, cb), [timestamp]);

  const getSnapshot = useMemo(() => () => store.getSnapshot(timestamp), [timestamp]);

  const timeAgo = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <div
      className={cn("w-full truncate", className)}
      title={title ?? getTimeAgo(timestamp)}
      suppressHydrationWarning
    >
      {timeAgo}
    </div>
  );
}
