"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SubnetIcon, DopIcon } from "@/shared/ui/icons";
import { ViewToggle } from "@/shared/ui/view-toggle";

export type LeaderboardView = "subnets" | "dopaminers";

const VIEW_PARAM = "view";

const LEADERBOARD_OPTIONS = [
  { value: "subnets" as const, label: <><SubnetIcon className="size-4" /> Subnets</> },
  { value: "dopaminers" as const, label: <><DopIcon className="size-4 text-white" />Creators</> },
];

export function LeaderboardViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const explicitView = searchParams.get(VIEW_PARAM) as LeaderboardView | null;
  const hasFilterParams = !!(searchParams.get("dopaminer_id") || searchParams.get("subnet_id"));
  const currentView: LeaderboardView =
    explicitView ?? (hasFilterParams ? "dopaminers" : "subnets");

  const setView = (view: LeaderboardView) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set(VIEW_PARAM, view);
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <ViewToggle
      options={LEADERBOARD_OPTIONS}
      value={currentView}
      onChange={setView}
      className="pt-2"
    />
  );
}
