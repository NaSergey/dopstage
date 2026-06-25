import { cn } from "@/shared/lib/utils/css";

function OctagonIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
      {...props}
    >
      <path
        d="M18.5586 2.97168L22.6123 8.5498V15.4492L18.5586 21.0273L12 23.1582L5.44043 21.0273L1.3877 15.4492V8.5498L5.44043 2.97168L12 0.84082L18.5586 2.97168Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default OctagonIcon;

