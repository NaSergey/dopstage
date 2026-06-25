import { Skeleton } from "@/shared/ui/skeleton";
import { TddIcon, LineMockIcon } from "@/shared/ui/icons";

export function TopTweetsPanelSkeleton() {
    return (
        <div className="flex gap-0.5 overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-black p-4 min-w-[260px] min-h-[216px] select-none"
                >
                    {/* Header - 1:1 with TweetCard layout */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 mask-octagon-rotated shrink-0" />
                        <Skeleton className="h-8 w-full rounded-none" />
                    </div>

                    {/* Two-column summary - same mt as TweetCard */}
                    <div className="grid grid-cols-2 gap-4 pt-5">
                        <div>
                            <div className="text-zinc-600 text-sm">
                                Estimated Dops
                            </div>

                        </div>
                    </div>

                    {/* Title block - same mt and h as TweetCard */}
                    <div className="mt-1">
                        <Skeleton className="h-10 w-full mb-0.5 rounded-none" />
                    </div>

                    {/* Community + FDV + sparkline - 1:1 with TweetCard */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-5 h-5 mask-octagon" />
                                <Skeleton className="h-4 w-20 rounded-none" />
                            </div>
                            <div className="inline-flex items-center gap-2">
                                <TddIcon className="w-[22px] h-[12px]" />
                                <div className="h-4 w-10 bg-black" />
                            </div>
                        </div>
                        <LineMockIcon className="w-24 h-8 rounded-none" />
                    </div>
                </div>
            ))}
        </div>
    );
}
