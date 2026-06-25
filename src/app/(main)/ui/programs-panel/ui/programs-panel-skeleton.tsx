import { Skeleton } from "@/shared/ui/skeleton";
import { FdvIcon } from "@/shared/ui/icons";
import { FdvWithFrame } from "./fdv-with-frame";

export function ProgramsPanelSkeleton() {
    return (
        <div className="flex gap-0.5 overflow-hidden">
            {Array.from({ length: 13 }).map((_, i) => (
                <div
                    key={i}
                    className="relative bg-zinc-900 w-[156px] h-[200px] flex-shrink-0 shadow-2xl grid grid-rows-[156px_4px_auto]"
                >
                    {/* Image skeleton */}
                    <div className="relative w-full h-full overflow-hidden">
                        <Skeleton className="w-full h-full" />
                    </div>

                    {/* Progress bar skeleton */}
                    <div className="w-full">
                        <Skeleton className="h-[4px] w-full bg-zinc-800" />
                    </div>

                    {/* TVD and FDV row */}
                    <div className="grid grid-cols-2 gap-0.5 items-center">
                        <div className="rounded flex items-center justify-start">
                            <div className="flex items-center gap-1.5 mt-0.5 pl-1 pr-0.5 pt-2 pb-1.5 leading-none">
                                <FdvIcon className="w-6 h-3.5 shrink-0" />
                            </div>
                        </div>
                        <div className="rounded relative overflow-hidden">
                            <div className="absolute inset-0" />
                            <div className="relative flex items-center justify-center pr-[1.5px] pt-2 pb-1.5">
                                <FdvWithFrame value="" gray />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
