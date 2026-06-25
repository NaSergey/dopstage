import React from "react";

interface SoloMentionIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const SoloMentionIcon: React.FC<SoloMentionIconProps> = ({
  className = "",
  width = 20,
  height = 20,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.25 13.3332V6.6665H9.73489L7.08337 8.88873"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6.66663 13.3335L13.3333 13.3335"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9.16663 13.3333V7.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 2.5L15.3033 4.6967L17.5 10L15.3033 15.3033L10 17.5L7.34835 16.4017L3.04598 16.954L3.59835 12.6517L2.5 10L4.6967 4.6967L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.76"
      />
    </svg>
  );
};

export default SoloMentionIcon;
