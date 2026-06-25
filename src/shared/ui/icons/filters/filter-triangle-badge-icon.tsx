import { cn } from "@/shared/lib/utils/css";

function FilterTriangleBadgeIcon({ className, ...props }: React.ComponentProps<"svg">) {
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
      <path d="M16.7354 2.64355L17.6865 5L16.7354 7.35742L14.4385 8.33398L12.1426 7.35742L11.1914 5L12.1426 2.64355L14.4385 1.66699L16.7354 2.64355ZM13.9668 4.94336L13.3594 4.32031L12.2129 5.4375L13.3936 6.64941L13.9668 7.2373L14.54 6.64941L16.6064 4.52832L16.0332 3.96973L15.4609 3.41113L13.9668 4.94336Z" fill="currentColor"/>
      <path d="M7.52373 3.33301H3.33325L12.4761 16.6663H16.6666L7.52373 3.33301Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7.44733 11.6663L2.5 17.4997H3.81929L8.33333 12.1772L9.16667 11.2497L8.33333 10.583L7.44733 11.6663Z" fill="currentColor"/>
    </svg>
  );
}

export default FilterTriangleBadgeIcon;

