import { rqClient } from "@/shared/api/instance";
import { refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { EmptyState } from "@/shared/ui/empty-state";
import { EmptyText } from "@/shared/ui/empty-text";
import { Skeleton } from "@/shared/ui/skeleton";
import AppTooltip from "@/shared/ui/app-tooltip";
import { ACHIEVEMENTS_CONFIG, Achievement } from "./constants";
import AchievementContainer from "./achievement-container";


interface AchievementsProps {
  id: string;
  iconSize?: "default" | "large";
  titleClassName?: string;
}


function Achievements({
  id,
  iconSize = "default",
  titleClassName,
}: AchievementsProps) {
  const { data, isLoading, error, refetch } = rqClient.useQuery(
    "get",
    "/api/v1/yapper_page/yapper/{yapper_id}/achievements",
    {
      params: { path: { yapper_id: id } },
    },
    {
      enabled: Boolean(id),
      keepPreviousData: true,
      refetchOnReconnect: refetchOnReconnect,
      placeholderData: (prev) => prev,
    },
  );
  const { showReload } = useErrorState(error, isLoading);
  const achievementsMap = new Map<string, Achievement>();
  data?.achievements?.forEach((achievement) => {
    achievementsMap.set(achievement.name.toLowerCase(), {
      enabled: achievement.is_obtained,
      description: achievement.description,
      timestamp: achievement.timestamp ?? 0,
      current_rank: achievement.current_rank ?? 0,
      rank_label: achievement.rank_label ?? "",
    });
  });
  const totalAchievements = ACHIEVEMENTS_CONFIG.filter(
    ({ name, getType }) => getType(achievementsMap.get(name)) !== "disabled",
  ).length;

  return (
    <div className="h-full">
      <h2
        className={`flex items-center justify-between gap-2 text-base leading-base font-medium mb-5 [@media(max-height:800px)]:mb-2 ${titleClassName ?? ""
          }`}
      >
        <div className="flex items-center gap-2">
          Achievements{" "}
          {isLoading ? (
            <Skeleton className="w-10 h-5" />
          ) : error && showReload ? null : (
            <div>
              (<EmptyText value={totalAchievements} formatter={(v) => String(v)} />)
            </div>
          )}
        </div>
        {error && showReload && (
          <div className="flex items-center">
            <EmptyState
              className="w-auto h-auto p-0"
              onReload={() => {
                void refetch();
              }}
              buttonSize={24}
              buttonClassName="w-[98px]"
            />
          </div>
        )}
      </h2>
      <div className="grid grid-cols-5 gap-2 place-items-center [@media(max-height:800px)]:gap-1.5">
        {ACHIEVEMENTS_CONFIG.map(({ key, name, Icon, title, description, getType }) => {
          const achievement = achievementsMap.get(name);
          const type = isLoading ? "disabled" : getType(achievement);
          const isEnabled = type !== "disabled";

          return (
            <AppTooltip
              key={key}
              content={
                <div className="flex flex-col gap-1 max-w-[200px]">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-xs text-zinc-400">{achievement?.description || description}</p>
                  {isEnabled && achievement?.timestamp ? (
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Unlocked: {new Date(achievement.timestamp * 1000).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              }
            >
              <AchievementContainer size={iconSize}>
                <Icon type={type} />
              </AchievementContainer>
            </AppTooltip>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;
