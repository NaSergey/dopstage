import { ProgramsLeaderboardTableServer } from "@/features/programs-leaderboard-table/programs-leaderboard-table-server";
import { UsersLeaderboardTable } from "@/app/leaderboard/components/users-leaderboard-table";
import { LeaderboardFilters } from "@/app/leaderboard/components/leaderboard-filters";
import { LeaderboardViewToggle } from "./components/leaderboard-view-toggle";
import { Suspense } from "react";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; dopaminer_id?: string; subnet_id?: string }>;
}) {
  const params = await searchParams;
  const hasFilterParams = !!(params.dopaminer_id || params.subnet_id);
  const view =
    params.view === "dopaminers"
      ? "dopaminers"
      : params.view === "subnets"
        ? "subnets"
        : hasFilterParams
          ? "dopaminers"
          : "subnets";

  return (
    <div className="flex flex-col">
        <div className="flex items-center justify-between bg-zinc-900">
          <h2 className="px-6 text-base leading-none font-medium text-white flex items-center gap-4">
            <Suspense>
              <LeaderboardViewToggle />
              {view === "dopaminers" && <LeaderboardFilters />}
            </Suspense>
          </h2>
        </div>
        {view === "subnets" ? (
          <ProgramsLeaderboardTableServer showSeeAllButton={false} pageSize={20} />
        ) : (
          <Suspense>
            <UsersLeaderboardTable />
          </Suspense>
        )}
    </div>
  );
}
