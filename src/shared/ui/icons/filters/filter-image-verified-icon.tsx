import { cn } from "@/shared/lib/utils/css";

function FilterImageVerifiedIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("transition-colors", className)}
      {...props}
    >
      <rect width="20" height="20" fill="currentColor" fillOpacity="0.1" />
      <path d="M9.99992 3.33301H4.66659L3.33325 4.66634V15.4997L4.66659 16.6663H15.3333L16.6666 15.333V9.99967" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M5 16.6663L10.4167 10.833H11.7708L16.6667 14.9997" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M5.83325 7.50033L6.66659 6.66699H7.49992L8.33325 7.50033V8.33366L7.49992 9.16699H6.66659L5.83325 8.33366V7.50033Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M16.6116 2.77051L17.6868 5.43457L16.6116 8.09961L14.0159 9.20312L11.4202 8.09961L10.345 5.43457L11.4202 2.77051L14.0159 1.66699L16.6116 2.77051ZM13.4807 5.52148L12.72 4.74023L12.1467 5.29785L11.5735 5.85645L12.9084 7.22656L13.4817 7.81445L14.0549 7.22656L16.3909 4.8291L15.2444 3.71191L13.4807 5.52148Z" fill="currentColor"/>
    </svg>
  );
}

export default FilterImageVerifiedIcon;

