"use client";

import { useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import {
  FallbackOctagon,
  FallbackSquare,
  FallbackOctagonWithText,
  FallbackSquareWithText,
} from "./icons";
import { normalizeImageUrl } from "@/shared/lib/utils/image";

type FallbackVariant =
  | "octagonRotated"
  | "octagon"
  | "octagonRotatedText"
  | "octagonText";

type AppImageProps = Omit<ImageProps, "src"> & {
  src: string | StaticImageData | null | undefined;
  fallbackVariant?: FallbackVariant;
};

const FALLBACK_ICON_MAP = {
  octagonRotated: FallbackOctagon,
  octagon: FallbackSquare,
  octagonRotatedText: FallbackOctagonWithText,
  octagonText: FallbackSquareWithText,
} as const;

export function AppImage({
  src,
  fallbackVariant = "octagonRotated",
  width,
  height,
  alt,
  className,
  style,
  ...props
}: AppImageProps) {
  const [hasError, setHasError] = useState(false);

  // Check if src is valid: either a non-empty string or a StaticImageData object
  const hasValidSrc =
    src &&
    ((typeof src === "string" && src.trim() !== "") ||
      (typeof src === "object" && "src" in src));
  const shouldShowFallback = hasError || !hasValidSrc;

  // If no src or error occurred, show fallback icon
  if (shouldShowFallback) {
    const iconWidth = typeof width === "number" ? width : 24;
    const iconHeight = typeof height === "number" ? height : 24;
    const IconComponent = FALLBACK_ICON_MAP[fallbackVariant];

    return (
      <div style={style}>
        <IconComponent
          width={iconWidth}
          height={iconHeight}
          className={className}
        />
      </div>
    );
  }

  // Normalize the image source
  const normalizedSrc = normalizeImageUrl(src as string | null | undefined);

  // Load the image
  return (
    <Image
      {...props}
      width={width}
      height={height}
      src={(normalizedSrc ?? src) as string | StaticImageData}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
