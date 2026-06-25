interface ChevronUpIconProps {
  className?: string;
}

function ChevronUpIcon({ className }: ChevronUpIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      className={className}
    >
      <path
        d="M0.800782 8.57617L0.800781 5.57617L5.80074 1.07614L10.8008 5.57617V8.57617"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default ChevronUpIcon;

