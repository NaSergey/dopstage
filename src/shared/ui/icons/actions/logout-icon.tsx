import { cn } from "@/shared/lib/utils/css";

function LogoutIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
      {...props}
    >
      <g clipPath="url(#clip0_8913_130314)">
        <path
          d="M7 9L8 9L11 6L8 3L7 3"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path d="M8.5 6L4 6" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M0.5 1.5L2.5 1.5L2.5 10.5H0.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </g>
      <defs>
        <clipPath id="clip0_8913_130314">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0 1 -1 0 12 0)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default LogoutIcon;
