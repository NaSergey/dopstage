import * as React from "react";

// Shrimp icon for rating = 1
function ShrimpIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g clipPath="url(#clip0_8681_79445)">
        <path d="M5.18373 9.47076L4.12364 7.7218" stroke="white" />
        <path d="M4.63477 11.4941L2.69003 12.5785" stroke="white" />
        <path
          d="M4.14989 4.00021L0.650069 7.50023L2.0123 12.9152L4.10524 14.1548L7.92631 14.036L11.6805 11.3852L7.68277 12.4169L4.66291 11.5876L5.19425 9.50183L7.14989 7.50021L14.1499 6.50024L14.6671 4.83106L12.1501 4.00023L8.14989 3.00021L4.14989 4.00021Z"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M14.6336 5.51728L15.7536 3.9334L14.5277 2.53804L12.1703 2.45938L9.87033 1.8901L9.52191 0.031487"
          stroke="white"
        />
        <ellipse
          cx="0.454023"
          cy="0.421593"
          rx="0.454023"
          ry="0.421593"
          transform="matrix(-0.958702 0.284413 0.284413 0.958702 8.69336 4.33398)"
          fill="white"
        />
        <path d="M7.79688 12.688L7.70153 13.3928" stroke="white" />
      </g>
      <defs>
        <clipPath id="clip0_8681_79445">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="matrix(-1 0 0 1 16 0)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ShrimpIcon;


