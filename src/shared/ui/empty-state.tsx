"use client";

import { cn } from "@/shared/lib/utils/css";
import { Button } from "@/shared/ui/button";
import { ReloadIcon, SadIcon } from "@/shared/ui/icons";
import type { ReactNode } from "react";

interface EmptyStateProps {
  showIcon?: boolean;
  title?: string;
  description?: string;
  className?: string;
  onReload?: () => void;
  renderReload?: (onReload: () => void) => ReactNode;
  buttonClassName?: string;
  buttonSize?: number;
}

export function EmptyState({
  showIcon = false,
  title = "",
  description = "",
  className,
  onReload,
  renderReload,
  buttonClassName,
  buttonSize,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-full h-full flex-col items-center justify-center text-zinc-600 relative",
        className,
      )}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {showIcon && (
          <div className="flex items-center justify-center mb-4">
            <SadIcon className="size-16" />
          </div>
        )}
        {(title || description) && (
          <div className="text-sm leading-sm space-y-1 mb-4">
            {title && (
              <p className="text-zinc-600 text-base font-medium">{title}</p>
            )}
            {description && <p className="text-zinc-400">{description}</p>}
          </div>
        )}
        {onReload &&
          (renderReload ? (
            renderReload(onReload)
          ) : (
            <Button
              variant="frame"
              frameHeight={buttonSize}
              onClick={onReload}
              className={cn("w-[139px]", buttonClassName)}
            >
              <ReloadIcon className="w-2 h-2 mr-2" />
              Reload
            </Button>
          ))}
      </div>
    </div>
  );
}
