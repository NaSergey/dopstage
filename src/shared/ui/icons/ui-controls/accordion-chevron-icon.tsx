import type React from "react"

function AccordionChevronIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M16.55 0V4.5L8.67505 12.375L0.800049 4.5V0"
        stroke="#71717A"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export default AccordionChevronIcon
