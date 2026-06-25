import { cn } from "@/shared/lib/utils/css";

function ChevronIcon({
  variants,
  className,
}: {
  variants: "up" | "down" | "left" | "right";
  className?: string;
}) {
  return (
    <svg
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-all",
        className,
        variants === "up"
          ? "rotate-180"
          : variants === "left"
            ? "-rotate-90"
            : variants === "right"
              ? "rotate-90"
              : "",
      )}
    >
      <path
        d="M1.66667 5.66667V4.33333L4 2L6.33333 4.33333V5.66667"
        strokeWidth="1.6"
        stroke="currentColor"
      />
    </svg>
  );
}

export default ChevronIcon;
