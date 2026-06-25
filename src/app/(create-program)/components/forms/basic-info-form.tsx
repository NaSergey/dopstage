"use client";

import * as React from "react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import InfoBanner from "../banners/info-banner";
import { useFormContext } from "react-hook-form";
import { ImageUploadField } from "./fields/image-upload-field";
import { SocialLinksField } from "./fields/social-links-field";
import { Button } from "@/shared/ui/button";
import { MinusIcon, PlusIcon } from "@/shared/ui/icons";
import { useCreateCampaignStore } from "../../store/use-create-campaign-store";

export function BasicInfoForm() {
  const methods = useFormContext();
  const { register, setValue, formState: { errors } } = methods;
  const { logoPreview, bannerPreview, setLogoPreview, setBannerPreview } = useCreateCampaignStore();

  const createChangeHandler = (type: "logo" | "banner") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue(type, file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === "logo") {
        setLogoPreview(base64String);
      } else {
        setBannerPreview(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = createChangeHandler("logo");
  const handleBannerChange = createChangeHandler("banner");

  const handleRemoveBanner = () => {
    setBannerPreview(undefined);
    setValue("banner", undefined);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10">
      <InfoBanner>
        Coin data (social links, banner, etc) can only be added now changed or edited after creation.
      </InfoBanner>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-50 mb-2">Coin name</label>
          <Input
            type="text"
            placeholder="Name your coin"
            inputMode="text"
            pattern="^[A-Za-z\\s-]+$"
            {...register("name", {
              setValueAs: (v: string) => (v ?? "").replace(/[^A-Za-z\s-]/g, "").trim(),
            })}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.value = (e.currentTarget.value ?? "").replace(/[^A-Za-z\s-]/g, "");
            }}
          />
          {errors?.name && <p className="text-red-400 text-xs mt-1">{String(errors.name.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-50 mb-2">Ticker</label>
          <Input
            type="text"
            placeholder="Add a coin ticker(e.g. DOGE)"
            inputMode="text"
            pattern="^[A-Za-z]+$"
            maxLength={10}
            {...register("ticker", {
              setValueAs: (v: string) => (v ?? "").replace(/[^A-Za-z]/g, "").toUpperCase(),
            })}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.value = (e.currentTarget.value ?? "").replace(/[^A-Za-z]/g, "").toUpperCase();
            }}
          />
          {errors?.ticker && <p className="text-red-400 text-xs mt-1">{String(errors.ticker.message)}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-50 mb-2">Description (optional)</label>
        <Textarea height={96} placeholder="Creators, subnets, keywords" {...register("description")} />
      </div>

      <div className="max-w-[285px]">
        <label className="block text-sm font-medium text-zinc-50 mb-2">X handle</label>
        <Input type="text" placeholder="Enter X handle" {...register("xHandle")} />
      </div>

      <div className="space-y-10">
        <ImageUploadField
          label="Coin logo"
          preview={logoPreview || null}
          onChange={handleLogoChange}
          ariaLabel="Select logo file"
          recommendations={
            <>
              <div>file size and type recommended</div>
              <div>• image - max 15mb. &quot;.jpg&quot;, &quot;.gif&quot; or &quot;.png&quot;</div>
              <div>• video - max 30mb. &quot;.mp4&quot;</div>
            </>
          }
        />

        <SocialLinksField />

        <div>
          <div className="flex items-center justify-between mb-2">
            <Button
              type="button"
              variant="frame-gray"
              className="w-[192px]"
              onClick={bannerPreview ? handleRemoveBanner : () => {
                // To satisfy type checker, as onChange expects ChangeEvent
                const bannerInput = document.createElement('input');
                bannerInput.type = 'file';
                bannerInput.accept = 'image/*';
                bannerInput.onchange = (e) => handleBannerChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                bannerInput.click();
              }}
              aria-label={bannerPreview ? "Remove banner" : "Add banner"}
            >
              {bannerPreview ? <MinusIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
              <span className="pl-2">{bannerPreview ? "Remove banner" : "Add banner"}</span>
            </Button>
          </div>
          {bannerPreview && (
            <ImageUploadField
              label=""
              preview={bannerPreview}
              onChange={handleBannerChange}
              onRemove={handleRemoveBanner}
              shape="rectangle"
              ariaLabel="Select banner file"
              recommendations={
                <>
                  <div>file size and type recommended</div>
                  <div>• image - max 4.3mb. &quot;.jpg&quot;, &quot;.gif&quot; or &quot;.png&quot;</div>
                  <div>• 3:1 aspect ratio, 1500x500px</div>
                </>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

