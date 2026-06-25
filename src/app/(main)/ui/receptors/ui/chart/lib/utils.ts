import { ImageUrl } from "../model/types";

export const getImageSrc = (image_url: ImageUrl): string => {
  if (!image_url) return "";
  if (typeof image_url === "string") return image_url;
  return image_url.src ?? "";
};