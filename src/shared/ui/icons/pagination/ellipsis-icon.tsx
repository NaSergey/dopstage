import * as React from "react";

type EllipsisIconProps = React.SVGProps<SVGSVGElement>;

export function EllipsisIcon({ className, ...props }: EllipsisIconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="12" y="16.667" width="2.66667" height="2.66667" fill="white" />
      <rect
        x="16.6667"
        y="16.667"
        width="2.66667"
        height="2.66667"
        fill="white"
      />
      <rect
        x="21.3333"
        y="16.667"
        width="2.66667"
        height="2.66667"
        fill="white"
      />
    </svg>
  );
}
