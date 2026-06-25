import { cn } from "@/shared/lib/utils/css";

function EditImageIcon({ className, ...props }: React.ComponentProps<"svg">) {
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
      {/* Base follows provided paths, strokes use currentColor for theming */}
      <path d="M12.5 8.5L6 15L5.5 18.5L9 18L15.5 11.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17 10L14 7L15.5 5.5H17.5L18.5 6.5V8.5L17 10Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default EditImageIcon;



