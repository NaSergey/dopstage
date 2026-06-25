"use client";

import { useFormContext } from "react-hook-form";
import { ProfilePreview } from "../review/profile-preview";
import { StatsPreview } from "../review/stats-preview";
import { BoostersPreview } from "../review/boosters-preview";
import { BannerPreview } from "../review/banner-preview";
import { useCreateCampaignStore } from "../../store/use-create-campaign-store";

export function ReviewForm() {
  const { watch } = useFormContext();
  const formValues = watch();
  const { logoPreview, bannerPreview } = useCreateCampaignStore();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <ProfilePreview 
        logoPreview={logoPreview || null}
        name={formValues.name}
        ticker={formValues.ticker}
        description={formValues.description}
        website={formValues.website}
        telegram={formValues.telegram}
        xHandle={formValues.xHandle}
      />
      <StatsPreview 
        rewardAllocation={formValues.rewardAllocation}
        devSupplyAllocation={formValues.devSupplyAllocation}
        campaignDays={formValues.campaignDays}
      />
      <BoostersPreview 
        boosters={formValues.boosters}
        filters={formValues.filters}
      />
      <BannerPreview bannerPreview={bannerPreview || null} />
    </div>
  );
}
