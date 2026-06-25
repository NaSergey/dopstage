function NewAuthorIcon({
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
        d="M9.16663 8.17529L6.97913 10.3628L6.66663 13.1753L9.47913 12.8628L11.6666 10.6753"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.99996 2.9165L4.99129 4.99116L2.91663 9.99984L3.95396 12.5042L3.43228 16.5675L7.49562 16.0458L9.99996 17.0832L15.0086 15.0085L17.0833 9.99984"
        stroke="currentColor"
        strokeWidth="1.76"
      />
      <path
        d="M16.4592 3.56543L17.5247 6.13867L16.4592 8.71094L13.887 9.77734L11.3157 8.71094L10.2502 6.13867L11.3157 3.56543L13.887 2.5L16.4592 3.56543ZM13.0881 5.33887H11.5725V6.93848H13.0881V8.4541H14.6877V6.93848H16.2024V5.33887H14.6877V3.82324H13.0881V5.33887Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default NewAuthorIcon;
