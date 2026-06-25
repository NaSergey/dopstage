import * as React from "react";

// Whale icon for rating = 4
function WhaleIcon({ className, ...props }: React.ComponentProps<"svg">) {
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
      <g clipPath="url(#clip0_8681_79454)">
        <path
          d="M9.03705 13.5307L7.28067 12.7453L5.99635 13.9794L3.5738 13.9886L5.51946 11.5187L4.31893 9.73994L3.38224 7.56203L3.49407 3.55478L1.91624 2.48187L1.38285 1.18122L3.25665 1.62791L3.88264 2.69394L4.67773 1.81999L6.57635 2.16258L5.62914 3.36698L4.26413 3.55499L5.92382 7.36113L10.0184 8.33723L12.3123 7.63721L15.1991 8.49998L15.199 10.5L13.7585 12.4926L11.7289 13.6224L12.0194 14.8651L10.383 13.5765L9.03705 13.5307Z"
          stroke="#6314FF"
          strokeWidth="1.5"
        />
        <path
          d="M15.4609 9.96533L14.4199 9.71717L10.7282 9.97393L7.91021 11.7958"
          stroke="#6314FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_8681_79454">
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

export default WhaleIcon;


