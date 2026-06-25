import { cn } from "@/shared/lib/utils/css";

function PlusIcon({
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
      <path d="M11.9952 20.0049L11.9952 13.4999" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.0052 10.5L12.0052 4.005" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default PlusIcon;

