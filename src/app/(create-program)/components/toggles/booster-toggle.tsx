import * as React from "react";
import { Switch } from "@/shared/ui/switch";

interface BoosterToggleProps {
  title: string;
  subtitle: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  leftIcon?: React.ReactNode;
}

export default function BoosterToggle({ title, subtitle, enabled, onChange, leftIcon }: BoosterToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-black">
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6">
            {leftIcon ?? (
              <div className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center text-xs"></div>
            )}
          </div>
          <p className="text-base font-medium text-zinc-50">{title}</p>
        </div>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}
