"use client";

import Image from "next/image";
import * as React from "react";

interface BannerPreviewProps {
  bannerPreview: string | null;
}

export function BannerPreview({ bannerPreview }: BannerPreviewProps) {
  const [bannerExpanded, setBannerExpanded] = React.useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setBannerExpanded(!bannerExpanded)}
        className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${bannerExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span>Campaign banner</span>
      </button>
      {bannerExpanded && (
        <div className="w-full h-48 bg-zinc-900 overflow-hidden">
          {bannerPreview ? (
            <Image src={bannerPreview} alt="Banner" width={1500} height={500} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-600">
              Banner Image
            </div>
          )}
        </div>
      )}
    </div>
  );
}
