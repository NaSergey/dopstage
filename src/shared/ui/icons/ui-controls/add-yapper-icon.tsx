function AddYapperIcon({ className, active }: { className?: string; active?: boolean }) {
  const bracketColor = active ? "white" : "#52525B";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#clip0_8681_79667)">
        <path d="M6 1H2.5L1 2.5V6" stroke={bracketColor} strokeWidth="1.6"/>
        <path d="M10 1H13.5L15 2.5V6" stroke={bracketColor} strokeWidth="1.6"/>
        <path d="M6 15H2.5L1 13.5V10" stroke={bracketColor} strokeWidth="1.6"/>
        <path d="M10 15H13.5L15 13.5V10" stroke={bracketColor} strokeWidth="1.6"/>
        <g clipPath="url(#clip1_8681_79667)">
          <path d="M9.99999 6.5532V8.5128L8.5 10H6.49999L5 8.5128V6.5L6.49999 5H8.5L9.99999 6.5532Z" stroke="white" strokeWidth="1.6"/>
          <path d="M10 10L11.5 11.5" stroke="white" strokeWidth="1.6"/>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8681_79667">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
        <clipPath id="clip1_8681_79667">
          <rect width="8" height="8" fill="white" transform="translate(4 4)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export default AddYapperIcon;
