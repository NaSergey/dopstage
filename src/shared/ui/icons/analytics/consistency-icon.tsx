function ConsistencyIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10 2.5L15.3033 4.6967L17.5 10L15.3033 15.3033L10 17.5L4.6967 15.3033L2.5 10L4.6967 4.6967L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="5 2.4"
      />
      <path
        d="M4.7 15.3169L2.5 10.0002L4.7 4.7002"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.99996 8.3335V9.72239L8.74996 12.5002H7.91663L6.66663 9.72239V8.3335"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      <path
        d="M13.3333 8.3335V9.72239L12.0833 12.5002H11.25L10 9.72239V8.3335"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      <path
        d="M4.77667 3.13817L6.94479 4.04359L6.07275 6.22536"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="bevel"
      />
    </svg>
  );
}

export default ConsistencyIcon;
