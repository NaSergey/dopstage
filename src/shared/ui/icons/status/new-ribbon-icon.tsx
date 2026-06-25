function NewRibbonIcon({ className }: { className?: string }) {
  return (
    <svg
      width="25"
      height="16"
      viewBox="0 0 25 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_6782_6562)">
        <path
          d="M0 1L12.5 3.5L25 1L22.5 8L25 15L12.5 12.5L0 15L2.5 8L0 1Z"
          fill="#55FF00"
        />
        <path d="M8 0L12.5 2.5L17 0V8V16L12.5 13.5L8 16V8V0Z" fill="#55FF00" />
        <path
          d="M18 5V7L19.5 11H21V7V5"
          stroke="black"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
        <path
          d="M15 5V7V11H16.5L18.0001 7V5"
          stroke="black"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
        <path
          d="M13.5 5H10.5V7.5M13 7.5H10.5M10.5 7.5V11H13.5"
          stroke="black"
          strokeWidth="1.6"
        />
        <path
          d="M8 5V11L7.5 11L4.5 5H4V11"
          stroke="black"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <clipPath id="clip0_6782_6562">
          <rect width="25" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default NewRibbonIcon;

