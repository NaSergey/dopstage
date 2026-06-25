function CloseIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3.6665 12.3337L12.3332 3.66699"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.66683 3.66699L12.3335 12.3337"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default CloseIcon;

