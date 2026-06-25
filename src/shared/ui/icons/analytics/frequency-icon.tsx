function FrequencyIcon({
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
        d="M8.08163 3.47754L4.83912 4.82063L3.22742 8.71163"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5.60754 2.5L8.54232 3.23369L7.07493 5.89816"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="bevel"
      />
      <path
        d="M16.5012 8.10274L15.1581 4.86024L11.2671 3.24853"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M17.4786 5.62891L16.7449 8.56368L14.0805 7.09629"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="bevel"
      />
      <path
        d="M11.8756 16.5225L15.1182 15.1794L16.7299 11.2884"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14.3497 17.5L11.415 16.7663L12.8823 14.1018"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="bevel"
      />
      <path
        d="M3.45605 11.8973L4.79914 15.1398L8.69015 16.7515"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M2.47864 14.3711L3.21233 11.4363L5.8768 12.9037"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="bevel"
      />
      <path
        d="M8.33337 12.5V7.5H10.8334L12.5 9.16667V10.8333L10.8334 12.5H8.33337Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default FrequencyIcon;
