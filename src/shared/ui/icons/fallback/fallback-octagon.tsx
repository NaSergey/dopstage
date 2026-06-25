type FallbackOctagonProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function FallbackOctagon({ className, width = 24, height = 24 }: FallbackOctagonProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_8323_87272)">
        <path
          d="M12 1.5L19.4246 4.57538L22.5 12L19.4246 19.4246L12 22.5L4.57538 19.4246L1.5 12L4.57538 4.57538L12 1.5Z"
          stroke="#52525B"
          strokeWidth="2"
        />
        <path
          d="M8 14.5L9.99989 12.5H14L16.0001 14.5"
          stroke="#52525B"
          strokeWidth="1.6"
        />
        <circle cx="10" cy="9" r="1" fill="#52525B" />
        <circle cx="14" cy="9" r="1" fill="#52525B" />
      </g>
      <defs>
        <clipPath id="clip0_8323_87272">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

