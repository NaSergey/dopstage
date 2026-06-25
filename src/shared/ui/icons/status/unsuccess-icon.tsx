function UnsuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_6782_2842)">
        <path
          d="M8 1L12.9497 3.05025L15 8L12.9497 12.9497L8 15L3.05025 12.9497L1 8L3.05025 3.05025L8 1Z"
          stroke="#FF002B"
          strokeWidth="1.6"
        />
        <path
          d="M4.00006 10.5L5.99995 8.5H10.0001L12.0002 10.5"
          stroke="#FF002B"
          strokeWidth="1.6"
        />
        <path d="M7 5.5L4.5 4.5" stroke="#FF002B" strokeWidth="1.6" />
        <path d="M9 5.5L11.5 4.5" stroke="#FF002B" strokeWidth="1.6" />
        <circle cx="6" cy="6" r="1" fill="#FF002B" />
        <circle cx="10" cy="6" r="1" fill="#FF002B" />
      </g>
      <defs>
        <clipPath id="clip0_6782_2842">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default UnsuccessIcon;

