import { cn } from "@/shared/lib/utils/css";

function ReloadIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
      {...props}
    >
      <path
        d="M13 7C13 8.18669 12.6481 9.34673 11.9888 10.3334C11.3295 11.3201 10.3925 12.0892 9.2961 12.5433C8.19975 12.9974 6.99335 13.1162 5.82946 12.8847C4.66558 12.6532 3.59648 12.0818 2.75736 11.2426C1.91825 10.4035 1.3468 9.33443 1.11529 8.17054C0.88378 7.00666 1.0026 5.80026 1.45673 4.7039C1.91085 3.60754 2.67989 2.67047 3.66658 2.01118C4.65328 1.35189 5.81331 1 7 1C8.68 1 10.2867 1.66667 11.4933 2.82667L13 4.33333M13 4.33333L13 1M13 4.33333H9.66667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ReloadIcon;

