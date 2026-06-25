function ImageCheckIcon({
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
        d="M10 3.3335H4.66671L3.33337 4.66683V15.5002L4.66671 16.6668H15.3334L16.6667 15.3335V10.0002"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 16.6668L10.4167 10.8335H11.7708L16.6667 15.0002"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5.83337 7.49984L6.66671 6.6665H7.50004L8.33337 7.49984V8.33317L7.50004 9.1665H6.66671L5.83337 8.33317V7.49984Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16.6117 2.77002L17.6869 5.43408L16.6117 8.09912L14.016 9.20264L11.4203 8.09912L10.3451 5.43408L11.4203 2.77002L14.016 1.6665L16.6117 2.77002ZM13.4808 5.521L12.7201 4.73975L12.1469 5.29736L11.5736 5.85596L12.9086 7.22607L13.4818 7.81396L14.0551 7.22607L16.391 4.82861L15.2445 3.71143L13.4808 5.521Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default ImageCheckIcon;
