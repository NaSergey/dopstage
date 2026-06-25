function ExternalLink({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M5 7L9 3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6.5 2.5L7.25 1.75H10.25V4.75L9.5 5.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5.77273 3.5H3.31818L2.5 4.31818V8.68182L3.31818 9.5H7.68182L8.5 8.68182V6.22727"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default ExternalLink;
