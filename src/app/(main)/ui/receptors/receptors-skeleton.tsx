import { Skeleton } from "@/shared/ui/skeleton";
import LoadingMask from "./ui/chart/ui/loading-mask";

/**
 * Right-panel (general info) loading grid. Shared between the full block
 * skeleton and the client component's loading state so the hand-off from the
 * Suspense fallback to the client render is seamless (no layout jump).
 */
export function InfoPanelSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-[1px]">
      <Skeleton className="col-span-2 h-12 w-full rounded-none" />
      <Skeleton className="col-span-1 h-20 w-full rounded-none" />
      <Skeleton className="col-span-1 h-20 w-full rounded-none" />
      <div className="col-span-2 h-[120px] flex gap-[1px]">
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    </div>
  );
}

/**
 * Full Receptors block skeleton, used as the Suspense fallback so the block
 * reserves its 252px of space and shows a stable loading state from the very
 * first paint instead of popping in after the server fetch resolves.
 */
export function ReceptorsSkeleton() {
  return (
    <div className="w-full flex justify-between mt-1 bg-[#09090B] h-[252px]">
      <div className="relative flex-grow h-full w-full">
        <LoadingMask />
      </div>
      <div className="w-[583px] [@media(max-width:1500px)]:w-[472px] shrink-0 ml-6">
        <InfoPanelSkeleton />
      </div>
    </div>
  );
}
