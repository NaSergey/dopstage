"use client";

import { useEffect, useState } from "react";
import InfoBanner from "../banners/info-banner";
import { InfoIcon, PlusIcon, MinusIcon } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button";
import RewardSlider from "../sliders/reward-slider";
import BoosterToggle from "../toggles/booster-toggle";
import RewardAllocationSection from "../sections/reward-allocation-section";
import { useFormContext } from "react-hook-form";
import { type CreateCampaignFormValues } from "../../form-schema";
import { boosterItems1, boosterItems2, filterIcons } from "./constants";
import { useCreateCampaignStore } from "../../store/use-create-campaign-store";

export function BoostersForm() {
  const methods = useFormContext<CreateCampaignFormValues>();
  const { watch, setValue } = methods;
  const { rewardAllocation, campaignDays, devSupplyAllocation, ticker, boosters, filters } = watch();
  const { logoPreview, showFilters, setShowFilters } = useCreateCampaignStore();
  const [enableAnimation, setEnableAnimation] = useState(false);

  useEffect(() => {
    // Defer setState to next frame to avoid react-hooks/set-state-in-effect:
    // synchronous setState in effect triggers cascading renders and hurts performance.
    const id = requestAnimationFrame(() => setEnableAnimation(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleToggle = (
    section: "boosters" | "filters",
    id: keyof typeof boosters | keyof typeof filters
  ) => {
    const currentValues = watch(section);
    setValue(
      `${section}.${id}` as `boosters.${keyof typeof boosters}` | `filters.${keyof typeof filters}`,
      !currentValues[id as keyof typeof currentValues]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <InfoBanner>
        Campaign settings can’t be changed after creation. We support linear distribution only.
      </InfoBanner>
      
      <div className="space-y-4">
        <h2 className="text-base font-medium text-zinc-50">Select reward</h2>
        <RewardAllocationSection
          value={rewardAllocation}
          onChange={(v) => setValue("rewardAllocation", v)}
          inputLabel="Allocation,%"
          tokenInfo={{
            iconSrc: logoPreview || '/profile-test.png',
            alt: ticker || 'Token',
            amount: ticker || '',
            fee: '~$10.56 fee'
          }}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-medium text-zinc-50">Campaign duration, days</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <RewardSlider 
              value={campaignDays} 
              min={0} 
              max={90} 
              onChange={(v) => setValue("campaignDays", v)} 
              suffix="d" 
            />
          </div>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Each 1-hour reward snapshot has approximately 0.00046 LOLT...
        </p>
      </div>

      <div className="relative flex items-center gap-3">
        <Button 
          variant="frame-gray" 
          className="w-[172px]"
          onClick={() => {
            setShowFilters(!showFilters);
          }}
        >
          {showFilters ? (
            <MinusIcon className="w-4 h-4" />
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
          <span className="pl-2">{showFilters ? "Remove filters" : "Add filters"}</span>
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {filterIcons.map(({ id, Icon }) => {
            const isBooster = boosterItems1.some(b => b.id === id);
            const section = isBooster ? "boosters" : "filters";
            const isEnabled = isBooster ? boosters[id as keyof typeof boosters] : filters[id as keyof typeof filters];
            return (
              <button 
                key={id} 
                onClick={() => handleToggle(section, id as keyof typeof boosters | keyof typeof filters)}
                className={`transition-colors h-5 w-5 cursor-pointer hover:opacity-80 ${isEnabled ? 'text-lime-500' : 'text-zinc-700'}`}
                aria-label={`Toggle ${id}`}
              >
                <Icon />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="text-sm text-zinc-400">
            <div>Add filters to increase</div>
            <div className="flex items-center gap-2">
              <span>rewards</span>
              <InfoIcon className="w-6 h-6 text-zinc-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div 
          className={`overflow-hidden ${enableAnimation ? 'transition-all ease-in-out' : ''} ${
            showFilters 
              ? 'max-h-[2000px] opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-2'
          }`}
        >
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-medium text-zinc-50">Boosters</h2>
              <p className="flex items-center gap-2 text-sm text-zinc-500">
                <span>Choose parameters to increase rewards</span>
                <InfoIcon className="w-5 h-5 text-zinc-600" />
              </p>
            </div>

            <div className="space-y-1">
              {boosterItems1.map(({ id, title, subtitle, Icon }) => (
                <BoosterToggle
                  key={id}
                  title={title}
                  subtitle={subtitle}
                  enabled={boosters?.[id as keyof typeof boosters]}
                  onChange={() => handleToggle("boosters", id as keyof typeof boosters)}
                  leftIcon={<span className="w-6 h-6 text-white"><Icon /></span>}
                />
              ))}
            </div>
          </div>
        </div>

        <div 
          className={`overflow-hidden ${enableAnimation ? 'transition-all ease-in-out' : ''} ${
            showFilters 
              ? 'max-h-[2000px] opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-2'
          }`}
        >
          <div className="space-y-1">
            <div className="pt-6 pb-4 space-y-1">
              <h2 className="text-base font-medium text-zinc-50">AI filters</h2>
              <p className="text-sm text-zinc-500">Define criteria for AI to check posts</p>
            </div>

            {boosterItems2.map(({ id, title, subtitle, Icon }) => (
              <BoosterToggle
                key={id}
                title={title}
                subtitle={subtitle}
                enabled={filters?.[id as keyof typeof filters]}
                onChange={() => handleToggle("filters", id as keyof typeof filters)}
                leftIcon={<span className="w-6 h-6 text-white"><Icon /></span>}
              />
            ))}

            <div className="pt-6 space-y-4 pb-3">
              <h2 className="text-base font-medium text-zinc-50">Dev Supply, 0% <span className="text-zinc-500">Change</span></h2>
              <p className="flex items-center gap-2 text-sm text-zinc-500">
                <span>~$10,56 fee...</span>
                <InfoIcon className="w-5 h-5 text-zinc-600" />
              </p>
            </div>
          </div>
        </div>
        <div className="">
              <RewardAllocationSection
                value={devSupplyAllocation}
                onChange={(v) => setValue("devSupplyAllocation", v)}
                inputLabel="%"
                inputWidthClass="w-[122px]"
                tokenInfo={{
                  iconSrc: logoPreview || '/profile-test.png',
                  alt: ticker || 'Token',
                  amount: ticker || '',
                  fee: '~$10.56 fee'
                }}
              />
            </div>
      </div>
    </div>
  );
}

