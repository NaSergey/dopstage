import React from "react";

interface SentimentIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const SentimentIcon: React.FC<SentimentIconProps> = ({
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
        d="M11.7046 5.90887L9.65918 5.22705"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M13.0684 5.90887L15.1139 5.22705"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <ellipse
        cx="11.0226"
        cy="6.25018"
        rx="0.681818"
        ry="0.681818"
        fill="currentColor"
      />
      <ellipse
        cx="13.7499"
        cy="6.25018"
        rx="0.681818"
        ry="0.681818"
        fill="currentColor"
      />
      <path
        d="M15.1137 9.3183L13.75 7.979H12.7273"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16.0024 11.2295L17.5001 7.61363L16.0024 3.99775L12.3865 2.5L8.77063 3.99775"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14.1939 11.9784L16.0019 11.2295L17.4996 7.61364L16.0019 3.99775L12.386 2.5L8.77012 3.99775L8.02124 5.80569"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7.61364 7.27246L11.2295 8.77021L12.7273 12.3861L11.2295 16.002L7.61364 17.4997L3.99775 16.002L2.5 12.3861L3.99775 8.77021L7.61364 7.27246Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <ellipse
        cx="5.95781"
        cy="11.4122"
        rx="0.73052"
        ry="0.730519"
        fill="currentColor"
      />
      <ellipse
        cx="9.36663"
        cy="11.4122"
        rx="0.73052"
        ry="0.730519"
        fill="currentColor"
      />
      <path
        d="M4.32605 12.7513L6.15235 14.5776H9.07443L10.9007 12.7513"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
};

export default SentimentIcon;
