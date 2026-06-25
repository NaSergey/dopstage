import { Skeleton } from "@/shared/ui/skeleton";

const days = ["S", "M", "T", "W", "T", "F", "S"];

function HeatmapLoadingMask() {
  return (
    <div className="grid grid-cols-[min-content_1fr] gap-1 w-full text-[11px] xl:text-xs leading-none ">
      {/* Weekday left column */}
      <div className="flex flex-col justify-between mt-4 text-zinc-700">
        {days.map((_, d) => (
          <div key={d} className="flex-1 flex items-center">
            {_.toLowerCase()}
          </div>
        ))}
      </div>

      <div>
        <div className="flex-1 flex flex-col h-full w-full">
          {/* ---- Month labels row ---- */}
          <Skeleton className="h-4 mb-1 " />

          <div className="grid grid-cols-11 w-full h-full gap-0.5">
            {Array.from({ length: 77 }).map((_, day) => (
              <Skeleton
                key={day}
                className="aspect-square mask-octagon-rotated"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatmapLoadingMask;