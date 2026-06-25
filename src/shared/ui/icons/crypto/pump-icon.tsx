import { cn } from "@/shared/lib/utils/css";

function PumpIcon({
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
      <g clipPath="url(#clip0_3965_76707)">
        <rect
          x="0.0243807"
          y="0.698364"
          width="5.58646"
          height="12.2232"
          rx="2.79323"
          transform="matrix(0.739273 0.673406 -0.690511 0.723321 8.6194 -0.823196)"
          stroke="currentColor"
        />
        <path
          d="M7.71897 8.24432L5.77421 10.2815C4.70898 11.3973 2.92059 11.4591 1.78014 10.4202C0.639882 9.38138 0.578789 7.635 1.64395 6.51922L3.58871 4.48206L7.71897 8.24432Z"
          fill="currentColor"
          stroke="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_3965_76707">
          <rect width="12" height="12.0002" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PumpIcon;
