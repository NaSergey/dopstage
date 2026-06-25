import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "@/shared/lib/utils/css";
import type * as TooltipPrimitive from "@radix-ui/react-tooltip";

function AppTooltip({
  children,
  content,
  tooltipClassName,
  dark = false,
  side = "top",
  sideOffset = 0,
  isOpen,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  tooltipClassName?: string;
  dark?: boolean;
  side?: React.ComponentProps<typeof TooltipPrimitive.Content>["side"];
  sideOffset?: number;
  isOpen?: boolean;
}) {

  return (
    <Tooltip open={isOpen}>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center">{children}</span>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "bg-transparent p-0",
          tooltipClassName,
        )}
        arrowClassName={cn(
          dark ? "bg-zinc-800 fill-zinc-800" : "bg-white fill-white",
        )}
      >
        <div
          className={cn(
            "tooltip-content",
            dark ? "bg-zinc-800 text-white" : "bg-white text-black",
          )}
        >
          {content}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default AppTooltip;
