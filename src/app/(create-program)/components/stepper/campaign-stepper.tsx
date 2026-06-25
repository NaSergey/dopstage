"use client";

import { AddOctagonIcon, CheckOctagonIcon, OctagonIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";

export type CampaignStepStatus = "completed" | "active" | "pending";

interface CampaignStepperProps {
  currentStep: number; // 0-indexed
  className?: string;
}

const STEPS = ["Create new coin", "Compaing details", "Sign creation"];

export function CampaignStepper({ currentStep, className }: CampaignStepperProps) {
  const getStepStatus = (index: number): CampaignStepStatus => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const getStepIcon = (status: CampaignStepStatus) => {
    switch (status) {
      case "completed":
        return <CheckOctagonIcon className="w-6 h-6 text-primary" />;
      case "active":
        return <AddOctagonIcon className="w-6 h-6 text-white" />;
      case "pending":
        return <OctagonIcon className="w-6 h-6 text-zinc-600" />;
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto h-20 relative", className)}>
      <div className="absolute top-3 left-3 right-3 h-[2px] z-0">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, #3f3f46, #3f3f46 2px, transparent 2px, transparent 8px)',
          }} 
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {STEPS.map((title, index) => {
        const status = getStepStatus(index);
        let positionClasses = "";
        if (index === 0) positionClasses = "left-0 items-start text-left";
        if (index === 1) positionClasses = "left-1/2 -translate-x-1/2 items-center text-center";
        if (index === 2) positionClasses = "right-0 items-end text-right";

        return (
          <div key={index} className={cn("absolute top-0 flex flex-col z-10", positionClasses)}>
            <div className="bg-zinc-950 px-1">
              {getStepIcon(status)}
            </div>
            <div className="mt-3">
              <span className={cn(
                "text-sm font-medium",
                status === "completed" && "text-primary",
                status === "active" && "text-white",
                status === "pending" && "text-zinc-600"
              )}>
                {title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

