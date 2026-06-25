import { cn } from "@/shared/lib/utils/css";

function CheckOctagonIcon({
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
      {/* Octagon background */}
      <path
        d="M12 0L19.0534 2.2918L23.4127 8.2918V15.7082L19.0534 21.7082L12 24L4.94658 21.7082L0.587322 15.7082V8.2918L4.94658 2.2918L12 0Z"
        fill="currentColor"
      />
      {/* Checkmark - centered in octagon */}
      <path
        d="M17 9L10.5 15.5L7.5 12.5"
        stroke="black"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default CheckOctagonIcon;

