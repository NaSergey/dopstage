import { Skeleton } from "@/shared/ui/skeleton";

export function YapperCheckHeaderSkeleton() {
  return (
    <div className="flex items-center pr-2 justify-between gap-4 [@media(max-height:800px)]:pl-2 pl-3 [@media(max-height:800px)]:py-2 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 w-full min-w-0">
          <Skeleton className="w-6 h-6 shrink-0 mask-octagon-rotated" />
          <Skeleton className="h-5 flex-1" />
        </div>
      </div>
      <Skeleton className="w-[84px] h-6 rounded-2xl flex-shrink-0 pr-2" />
    </div>
  );
}
