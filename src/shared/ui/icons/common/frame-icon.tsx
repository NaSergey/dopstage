function FrameIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="85" 
      height="26" 
      viewBox="0 0 85 26" 
      fill="none"
      className={className}
    >
      <path 
        d="M4.90698 1H80.093L84 5.11111V20.8889L80.093 25H4.90698L1 20.8889V5.11111L4.90698 1Z" 
        stroke="#D9D9D9" 
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default FrameIcon;

