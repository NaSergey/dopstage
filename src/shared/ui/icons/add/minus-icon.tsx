import { cn } from "@/shared/lib/utils/css";

function MinusIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("transition-colors", className)}
      {...props}
    >
      <path d="M4 12H20" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default MinusIcon;

