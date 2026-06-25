import { cn } from "@/shared/lib/utils/css";

interface CarouselArrowIconProps {
  direction?: "left" | "right";
  className?: string;
}

function CarouselArrowIcon({
  direction = "right",
  className,
}: CarouselArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn(className, direction === "left" ? "rotate-180" : "")}
    >
      <path
        d="M8.125 15H10.625L15.625 10L10.625 5H8.125"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 10H3.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CarouselArrowIcon;


