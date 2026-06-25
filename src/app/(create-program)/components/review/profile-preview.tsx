"use client";

import { AppImage } from "@/shared/ui/app-image";
import { WebsiteIcon, XIcon, TelegramIcon } from "@/shared/ui/icons";

interface ProfilePreviewProps {
  logoPreview: string | null;
  name: string;
  ticker: string;
  description: string;
  website: string;
  telegram: string;
  xHandle: string;
}

export function ProfilePreview({
  logoPreview,
  name,
  ticker,
  description,
  website,
  telegram,
  xHandle
}: ProfilePreviewProps) {
  return (
    <div className="flex gap-8 p-6 ">
      <div className="flex-shrink-0">
        <div className="w-24 h-24 bg-lime-500 rounded-lg flex items-center justify-center mask-octagon">
          <AppImage
            src={logoPreview || "/profile-test.png"}
            alt={name || "Profile"}
            width={96}
            height={96}
            className="w-24 h-24 mask-octagon object-cover"
            fallbackVariant="octagon"
          />
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-medium text-white">{name || "Unnamed"}</h2>
          {ticker && (
            <span className="px-2 py-0.5 bg-[#6214ff40] text-base text-white">
              {ticker.toUpperCase()}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
        )}

        <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
          {website && (
            <a href="#" className="flex items-center gap-2 hover:text-zinc-50 transition-colors">
            <WebsiteIcon className="w-4 h-4 " />
            <span className="text-zinc-50">{website.replace(/^https?:\/\//, "")}</span>
          </a>
          )}
          {xHandle && (
            <a href="#" className="flex items-center gap-2 hover:text-zinc-200 transition-colors">
            <XIcon className="w-4 h-4" />
            <span className="text-zinc-50">@{xHandle.replace(/^@/, "")}</span>
          </a>
          )}
          {telegram && (
            <a href="#" className="flex items-center gap-2 hover:text-zinc-200 transition-colors">
              <TelegramIcon className="w-4 h-4" />
              <span className="text-zinc-50">{telegram.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
