import { cn } from "@/shared/lib/utils/css";

function ArrowIcon({
  className,
  variants,
}: {
  className?: string;
  variants?: "up" | "down";
}) {
  return (
    <svg
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, variants === "up" ? "rotate-180" : "")}
    >
      <path
        d="M1.5 0.5L3.5 3H4.5L6.5 0.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default ArrowIcon;
