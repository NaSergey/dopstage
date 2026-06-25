import * as React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export default function SelectFileIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? 16}
      height={props.height ?? 16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_7807_29088)">
        <path
          d="M1.5 3L3 1.5H13L14.5 3V13L13 14.5H3L1.5 13V3Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M4.5 14.5L10.5 8.5H11.5L14.5 11.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M4.5 5.5L5.5 4.5H6.5L7.5 5.5V6.5L6.5 7.5H5.5L4.5 6.5V5.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </g>
      <defs>
        <clipPath id="clip0_7807_29088">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}


