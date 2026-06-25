import { Skeleton } from "@/shared/ui/skeleton";
import { LineMockIcon } from "@/shared/ui/icons";

export function YapperCheckStatsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-3 items-center px-4 py-3 bg-zinc-800 relative left-[-16px] right-[-16px] w-[calc(100%+32px)]">
        <div className="space-y-1 [@media(max-height:800px)]:pl-2 pl-3">
          <Skeleton className="h-3 w-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.20)_0.01%,rgba(255,255,255,0.05)_100%)]" />
          <Skeleton className="h-4 w-12 bg-[linear-gradient(90deg,rgba(255,255,255,0.20)_0.01%,rgba(255,255,255,0.05)_100%)]" />
        </div>
        <div className="col-start-2 justify-self-center space-y-1">
          <Skeleton className="h-3 w-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.20)_0.01%,rgba(255,255,255,0.05)_100%)]" />
          <Skeleton className="h-4 w-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.20)_0.01%,rgba(255,255,255,0.05)_100%)]" />
        </div>
      </div>

      <div className="mt-4.5 [@media(max-height:800px)]:pl-2 pl-3 pr-4 py-2 grid grid-cols-[1fr_100px_100px] gap-x-1.5 gap-y-3">
        <div className="flex flex-col gap-4 max-w-[124px]">
          <div className="text-sm line-height-sm">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-16" />
              <div className="w-full h-[28px] flex items-center justify-center">
                <LineMockIcon className="[&_svg]:w-full [&_svg]:h-auto" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </>
  );
}
