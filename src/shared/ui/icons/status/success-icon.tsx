function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_6782_17611)">
        <path
          d="M8 1L12.9497 3.05025L15 8L12.9497 12.9497L8 15L3.05025 12.9497L1 8L3.05025 3.05025L8 1Z"
          stroke="#55FF00"
          strokeWidth="1.6"
        />
        <path
          d="M3.49985 8.5L5.99985 11H9.99985L12.4998 8.5"
          stroke="#55FF00"
          strokeWidth="1.6"
        />
        <circle cx="6" cy="7" r="1" fill="#55FF00" />
        <circle cx="10" cy="7" r="1" fill="#55FF00" />
      </g>
      <defs>
        <clipPath id="clip0_6782_17611">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SuccessIcon;

