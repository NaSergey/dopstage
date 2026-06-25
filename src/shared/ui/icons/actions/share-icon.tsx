import { cn } from "@/shared/lib/utils/css";

function ShareIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      width={props.width ?? 12}
      height={props.height ?? 12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
      {...props}
    >
      <g clipPath="url(#clip0_8010_44782)">
        <path
          d="M9 5L9 4L6 1L3 4L3 5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path d="M6 3.5L6 8" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M1.5 8.5V10.5H10.5V8.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </g>
      <defs>
        <clipPath id="clip0_8010_44782">
          <rect width="12" height="12" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ShareIcon;
