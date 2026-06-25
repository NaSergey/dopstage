type FallbackSquareProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function FallbackSquare({ className, width = 20, height = 20 }: FallbackSquareProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <mask
        id="mask0_8323_87273"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20"
      >
        <path d="M0 4L4 0L16 0L20 4V16L16 20H4L0 16V4Z" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_8323_87273)">
        <path
          d="M6 13.5L7.99989 11.5H12L14.0001 13.5"
          stroke="#52525B"
          strokeWidth="1.6"
        />
        <circle cx="8" cy="8" r="1" fill="#52525B" />
        <circle cx="12" cy="8" r="1" fill="#52525B" />
        <path d="M19 1V19H1V1H19Z" stroke="#52525B" strokeWidth="2" />
      </g>
    </svg>
  );
}

