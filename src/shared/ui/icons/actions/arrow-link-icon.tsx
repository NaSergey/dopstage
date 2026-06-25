import { cn } from "@/shared/lib/utils/css";

interface ArrowLinkIconProps {
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

function ArrowLinkIcon({
  className,
  direction = "right",
}: ArrowLinkIconProps) {
  const rotationMap = {
    right: "0deg",
    left: "180deg",
    up: "-90deg",
    down: "90deg",
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      style={{
        transform: `rotate(${rotationMap[direction]})`,
      }}
    >
      <path
        d="M6.5 12H8.5L12.5 8L8.5 4L6.5 4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9 8H3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default ArrowLinkIcon;

