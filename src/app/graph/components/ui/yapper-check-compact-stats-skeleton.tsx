import { Skeleton } from "@/shared/ui/skeleton";

const skeletonGradient = "bg-[linear-gradient(90deg,rgba(255,255,255,0.20)_0.01%,rgba(255,255,255,0.05)_100%)]";

export function YapperCheckCompactStatsSkeleton() {
  return (
    <div className="grid grid-cols-3 [@media(max-height:800px)]:pl-2">
      {/* Row 1 */}
      <div className={`bg-zinc-800 py-2 pl-2 space-y-0.5`}>
        <Skeleton className={`h-[18px] w-20 ${skeletonGradient}`} />
        <Skeleton className={`h-[18px] w-12 ${skeletonGradient}`} />
      </div>
      <div className={`bg-zinc-800 py-2 space-y-0.5`}>
        <Skeleton className={`h-[18px] w-20 ${skeletonGradient}`} />
        <Skeleton className={`h-[18px] w-12 ${skeletonGradient}`} />
      </div>
      <div className={`bg-zinc-800 py-2 space-y-0.5`}>
        <Skeleton className={`h-[18px] w-20 ${skeletonGradient}`} />
        <Skeleton className={`h-[18px] w-12 ${skeletonGradient}`} />
      </div>

      {/* Row 2 */}
      <div className="mt-4.5 py-2 pl-2 space-y-0.5">
        <Skeleton className="h-[18px] w-20" />
        <Skeleton className="h-[18px] w-12" />
      </div>
      <div className="mt-4.5 py-2 space-y-0.5">
        <Skeleton className="h-[18px] w-16" />
        <Skeleton className="h-[18px] w-10" />
      </div>
      <div className="mt-4.5 py-2 space-y-0.5">
        <Skeleton className="h-[18px] w-24" />
        <Skeleton className="h-[18px] w-16" />
      </div>
    </div>
  );
}
