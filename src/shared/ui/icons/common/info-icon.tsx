function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_2675_74453)">
        <path
          d="M8 7.3335L8 11.3335"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M7.88883 1.22217L12.6029 3.17479L14.5555 7.88883L12.6029 12.6029L7.88883 14.5555L3.17479 12.6029L1.22217 7.88883L3.17479 3.17479L7.88883 1.22217Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 4.6665L8.70711 4.9594L9 5.6665L8.70711 6.37361L8 6.6665L7.29289 6.37361L7 5.6665L7.29289 4.9594L8 4.6665Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2675_74453">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default InfoIcon;
