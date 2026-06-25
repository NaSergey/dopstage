function NewIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="8"
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="16" height="8" fill="#55FF00" />
      <path
        d="M14 2V6H13L12 3.5V2"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <path
        d="M10 2V3.5V6H11L12 3.5V2"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <path
        d="M8.5 2H6.5V4M8 4H6.5M6.5 4V6H8.5"
        stroke="black"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 2V6L4 6.00003L2.5 2H2V6.00003"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default NewIcon;

