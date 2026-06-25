import * as React from "react";

// Shark icon for rating = 3
function SharkIcon({ className, ...props }: React.ComponentProps<"svg">) {
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
      <g clipPath="url(#clip0_8681_79448)">
        <ellipse
          cx="13.2424"
          cy="7.62216"
          rx="0.355646"
          ry="0.343348"
          fill="#FF5500"
        />
        <path
          d="M13.6339 6.45504L15.4845 8.0001L13.6339 9.88851L11.639 10.3349L10.6366 11.7426L9.75054 10.3349H8.80732L6.44007 10.9529L5.97372 9.51083L3.8038 8.82413L0.548828 9.71684L1.47078 7.75976L0.759489 5.45933L3.8038 7.17607L7.11258 6.21469V5.45933L8.54883 4.08594L10.6366 6.07735L13.6339 6.45504Z"
          stroke="#FF5500"
          strokeWidth="1.5"
        />
        <path d="M9.57422 6.5H6.57422" stroke="#FF5500" />
      </g>
      <defs>
        <clipPath id="clip0_8681_79448">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SharkIcon;


