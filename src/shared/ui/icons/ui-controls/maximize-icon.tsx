interface IMaximizeIconProps {
  className?: string;
}

function MaximizeIcon({ className }: IMaximizeIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M13.5 10.5L17 7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 13.5L7 17" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 6L13.5 4.5H19.5V10.5L18 12"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 18L10.5 19.5L4.5 19.5L4.5 13.5L6 12"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default MaximizeIcon;
