import { cn } from "@/shared/lib/utils/css";

interface JellyfishDotProps {
    isLive: boolean;
    className?: string;
}

export function JellyfishDot({ isLive, className }: JellyfishDotProps) {
    const ringColor = isLive ? "bg-lime-500" : "bg-red-500";
    const dotColor = isLive ? "bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";

    return (
        <div className={cn("relative flex-none flex mr-3 items-center justify-center w-3 h-3 overflow-visible isolate", className)}>
            <div
                className={cn(
                    "absolute w-1.5 h-1.5 rounded-full z-10 m-auto inset-0",
                    dotColor,
                    isLive && "animate-pulse-dot"
                )}
            />
            {isLive && (
                <>
                    <div className={cn("absolute inset-0 m-auto w-2 h-2 rounded-full animate-jellyfish z-0 opacity-0 pointer-events-none select-none", ringColor)} />
                </>
            )}
        </div>
    );
}
