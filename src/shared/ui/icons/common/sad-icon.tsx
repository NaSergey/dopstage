function SadIcon({ className }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32 4L51.799 12.201L60 32L51.799 51.799L32 60L12.201 51.799L4 32L12.201 12.201L32 4Z"
        stroke="#52525B"
        strokeWidth="4"
      />
      <path
        d="M16.0002 42L23.9998 34H40.0002L48.0007 42"
        stroke="#52525B"
        strokeWidth="4"
      />
      <circle cx="24" cy="24" r="4" fill="#52525B" />
      <circle cx="40" cy="24" r="4" fill="#52525B" />
    </svg>
  );
}

export default SadIcon;
