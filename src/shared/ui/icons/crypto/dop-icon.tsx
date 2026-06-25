import { cn } from "@/shared/lib/utils/css";

function DopIcon({
  className,
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#6314FF]", className)}
    >
      <path
        d="M12.3022 1.52832L15.2084 5.52832V10.4717L12.3022 14.4717L7.60001 16L2.89786 14.4717L-0.00839233 10.4717V5.52832L2.89786 1.52832L7.60001 0L12.3022 1.52832ZM4.60001 4V12H7.79922L7.98282 11.9238L10.1039 11.0449L10.4867 10.8867L10.6449 10.5039L11.5238 8.38281L11.682 8L11.5238 7.61719L10.6449 5.49609L10.4867 5.11328L10.1039 4.95508L7.98282 4.07617L7.79922 4H4.60001ZM7.40079 6L8.95547 6.64355L9.517 8L8.95547 9.35547L7.40079 10H6.60001V6H7.40079Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default DopIcon;
