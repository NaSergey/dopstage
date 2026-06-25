function YapPricePanelIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_7231_57502)">
        <path
          d="M16 2V14L14 16H2L0 14V2L2 0H14L16 2ZM3.0498 3.0498L1 8L3.0498 12.9502L8 15L12.9502 12.9502L15 8L12.9502 3.0498L8 1L3.0498 3.0498Z"
          fill="white"
        />
        <path
          d="M6.5 11.5V9M6.5 9V5H9L10.5 7L9 9H6.5Z"
          stroke="white"
          strokeWidth="1.6"
        />
      </g>
      <defs>
        <clipPath id="clip0_7231_57502">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default YapPricePanelIcon;


