import * as React from "react";

// Dolphin icon for rating = 4
function DolphinIcon({ className, ...props }: React.ComponentProps<"svg">) {
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
      <g clipPath="url(#clip0_8681_79457)">
        <path
          d="M7.54661 1.23911L5.79018 2.36418L3.98755 2.34032L2.30924 3.14201L4.09966 3.96305L3.0992 6.06348L2.44594 8.54934L2.97371 12.5222L1.69288 14.232L1.77393 14.9998L3.76687 13.6877L5.46246 13.9632L5.12988 13.1383L4.07242 12.4804L5.20313 8.35516L9.10829 5.11291L10.0771 7.51611L10.9062 6.05601L10.83 4.41883L15.2007 3.36569L15.2418 2.64025L13.9558 2.44982L12.803 1.31754L10.4178 0.707093L7.54661 1.23911Z"
          stroke="#00BDFC"
          strokeWidth="1.5"
        />
        <path d="M13.9766 2.39941L13.1383 3.11265" stroke="#00BDFC" />
      </g>
      <defs>
        <clipPath id="clip0_8681_79457">
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

export default DolphinIcon;


