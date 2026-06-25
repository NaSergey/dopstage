import { cn } from "@/shared/lib/utils/css";
import { Skeleton } from "@/shared/ui/skeleton";

interface LoadingMaskProps {
  className?: string;
}

function LoadingMask({ className }: LoadingMaskProps) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full bg-zinc-950 h-full p-10",
        className,
      )}
    >
      <svg
        width="746"
        height="194"
        viewBox="0 0 746 194"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={"w-full h-full animate-pulse"}
      >
        <path
          d="M745.562 23.7789L697.138 0.791016L638.792 59.8627L531.385 123.763L423.977 9.45768L370.273 80.8407L316.57 72.2238L262.866 162.037L209.162 171.85L155.459 104.481L101.755 63.7789L45.821 117.285L0.5625 193.098"
          stroke="url(#paint0_linear_9071_135115)"
          strokeOpacity="0.5"
          strokeWidth="1.31111"
        />
        <defs>
          <linearGradient
            id="paint0_linear_9071_135115"
            x1="745.507"
            y1="96.9443"
            x2="0.562524"
            y2="96.9443"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.4" />
            <stop offset="1" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="grid grid-cols-6 justify-items-center absolute top-0 left-0 w-full h-full px-10 pb-5">
        <div className="border-l border-[#333333] border-dashed"></div>
        <div className="border-l border-[#333333] border-dashed"></div>
        <div className="border-l border-[#333333] border-dashed"></div>
        <div className="border-l border-[#333333] border-dashed"></div>
        <div className="border-l border-[#333333] border-dashed"></div>
        <div className="border-l border-[#333333] border-dashed"></div>
      </div>

      <Skeleton className="absolute bottom-0 left-0 w-full h-5 bg-[#0E0E0E]" />
    </div>
  );
}

export default LoadingMask;
