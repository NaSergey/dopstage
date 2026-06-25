import { cn } from "@/shared/lib/utils/css";

function VerifiedIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      width={props.width ?? 10}
      height={props.height ?? 10}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
      {...props}
    >
      <g clipPath="url(#clip0_9096_142908)">
        <path
          d="M5 0L6.39715 1.16136L8.21394 1.16978L8.53771 2.9575L9.92404 4.13176L9.02294 5.70935L9.33013 7.5L7.62579 8.12929L6.7101 9.69846L5 9.085L3.2899 9.69846L2.37421 8.12929L0.669873 7.5L0.97706 5.70935L0.0759611 4.13176L1.46229 2.9575L1.78606 1.16978L3.60285 1.16136L5 0Z"
          fill="white"
        />
        <path
          d="M7.1875 3.125L4.6875 6.5625H4.0625L2.8125 4.6875"
          stroke="black"
          strokeWidth={1.25}
        />
      </g>
      <defs>
        <clipPath id="clip0_9096_142908">
          <rect width="10" height="10" rx="5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default VerifiedIcon;
