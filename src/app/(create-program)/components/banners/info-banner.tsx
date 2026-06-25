"use client";

import * as React from "react";
import { InfoIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";

interface InfoBannerProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoBanner({ children, className }: InfoBannerProps) {
  return (
    <div className={cn("flex gap-2 text-sm bg-zinc-900 px-2 py-3 text-zinc-600 mb-6", className)}>
      <InfoIcon className="w-6 h-6 text-zinc-600" />
      {children}
    </div>
  );
}

export default InfoBanner;


