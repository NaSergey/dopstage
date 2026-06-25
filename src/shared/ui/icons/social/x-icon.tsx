import { cn } from "@/shared/lib/utils/css";
import React from "react";

interface XIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const XIcon: React.FC<XIconProps> = ({
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
      <path
        d="M3.06615 0.779804H1.44011L8.92476 11.2557H10.5508L3.06615 0.779804ZM0 0H3.57328L6.67142 4.41188L10.5503 0H11.6089L7.1415 5.08129L12 12H8.42672L5.15493 7.34084L1.05866 12H0L4.68485 6.67142L0 0Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default XIcon;
