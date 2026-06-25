import * as React from "react";

// Plankton icon for rating = 2
function PlanktonIcon({ className, ...props }: React.ComponentProps<"svg">) {
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
      <g clipPath="url(#clip0_8681_79451)">
        <path
          d="M5.2207 6.85817L5.526 9.29998L5.99976 13.0002L6.99976 15.0002H10.4998L11.4998 13.0002L11.3252 9.29998V6.58293L9.79911 5.33203H6.74684L5.2207 6.85817Z"
          stroke="#FFFF00"
          strokeWidth="1.5"
        />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#FFFF00" />
        <path
          d="M4 0.753418L5.9781 1.10965L7.06794 2.93514L7.72185 5.25106"
          stroke="#FFFF00"
          strokeWidth="1.5"
        />
        <path
          d="M11.9355 0.448242L9.49373 1.66915L8.91608 2.96634L8.91541 5.37281"
          stroke="#FFFF00"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_8681_79451">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PlanktonIcon;


