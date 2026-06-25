import { cn } from "@/shared/lib/utils/css";
import React from "react";

interface WebsiteIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const WebsiteIcon: React.FC<WebsiteIconProps> = ({
  className = "",
  width = 12,
  height = 12,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
    >
      <g clipPath="url(#clip0_3965_76699)">
        <path
          d="M11.25 6L9.71231 9.71231L6 11.25L2.28769 9.71231L0.75 6L2.28769 2.28769L6 0.75L9.71231 2.28769L11.25 6Z"
          stroke="currentColor"
        />
        <path
          d="M8.25 6L7.59099 9.71231L6 11.25L4.40901 9.71231L3.75 6L4.40901 2.28769L6 0.75L7.59099 2.28769L8.25 6Z"
          stroke="currentColor"
          strokeLinejoin="bevel"
        />
        <path d="M1.125 6H10.875" stroke="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_3965_76699">
          <rect width="12" height="12" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default WebsiteIcon;
