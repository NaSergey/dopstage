import { Input } from "@/shared/ui/input";
import RewardSlider from "../sliders/reward-slider";
import { AppImage } from "@/shared/ui/app-image";
import * as React from "react";

interface RewardAllocationSectionProps {
  value: number;
  onChange: (value: number) => void;
  onChangeComplete?: (value: number) => void;
  inputLabel: string;
  inputWidthClass?: string;
  tokenInfo?: {
    iconSrc: string;
    alt: string;
    amount: string;
    fee: string;
  };
  sliderProps?: {
    min?: number;
    max?: number;
    suffix?: string;
  };
}

export default function RewardAllocationSection({
  value,
  onChange,
  onChangeComplete,
  inputLabel,
  inputWidthClass = "w-[206px]",
  tokenInfo,
  sliderProps = { min: 0, max: 100 },
}: RewardAllocationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <RewardSlider
            value={value}
            min={sliderProps.min}
            max={sliderProps.max}
            onChange={onChange}
            onChangeComplete={onChangeComplete}
            suffix={sliderProps.suffix}
          />
        </div>
        <div className={inputWidthClass}>
          <label className="block text-xs font-medium text-white mb-2">
            {inputLabel}
          </label>
          <Input
            bgClassName="bg-zinc-900"
            type="text"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      </div>
      {tokenInfo && (
        <div className="flex items-center gap-2 text-sm text-zinc-50">
          <AppImage
            src={tokenInfo.iconSrc}
            alt={tokenInfo.alt}
            className="mask-octagon"
            width={16}
            height={16}
            fallbackVariant="octagon"
          />
          <span>{tokenInfo.amount}</span>
          <span className="text-zinc-600">{tokenInfo.fee}</span>
        </div>
      )}
    </div>
  );
}
