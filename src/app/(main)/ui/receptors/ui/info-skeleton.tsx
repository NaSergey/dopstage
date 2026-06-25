import { Skeleton } from "@/shared/ui/skeleton";

function InfoSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-[1px] h-full">
      {/* Key Metrics row */}
      <Skeleton className="col-span-4 rounded-none" />
      <Skeleton className="col-span-2 rounded-none" />

      {/* Second row - 3 items */}
      <Skeleton className="col-span-2 rounded-none" />
      <Skeleton className="col-span-2 rounded-none" />
      <Skeleton className="col-span-2 rounded-none" />

      {/* Four lines row */}
      <Skeleton className="col-span-3 rounded-none" />
      <Skeleton className="col-span-3 rounded-none" />
      <Skeleton className="col-span-3 rounded-none" />
      <Skeleton className="col-span-3 rounded-none" />
    </div>
  );
}

export default InfoSkeleton;
