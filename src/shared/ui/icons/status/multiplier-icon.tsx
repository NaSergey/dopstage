function MultiplierIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_8010_14357)">
        <path
          d="M2 2L10 10"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="square"
        />
        <path
          d="M2 10L3 9"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="square"
        />
        <path
          d="M9 3L10 2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <clipPath id="clip0_8010_14357">
          <rect width="12" height="12" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default MultiplierIcon;
