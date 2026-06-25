import { cn } from "@/shared/lib/utils/css";

function CopyIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
      {...props}
    >
      <g clipPath="url(#clip0_3965_76696)">
        <path
          d="M4.5 5.5L5.5 4.5H10L11 5.5V10L10 11H5.5L4.5 10V5.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M7.5 2L6.5 1H2L1 2V6.5L2 7.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </g>
      <defs>
        <clipPath id="clip0_3965_76696">
          <rect width="12" height="12" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default CopyIcon;
