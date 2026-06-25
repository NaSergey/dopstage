import { SVGProps } from "react";

function GemIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="12" 
      height="16" 
      viewBox="0 0 12 16" 
      fill="none"
      {...props}
    >
      <path 
        d="M5.5 2L7 4.5L9.53553 6.46447L11 10L9.53553 13.5355L6 15L2.46447 13.5355L1 10L1.73223 8.23223L4 9.5L5 8.5L4 6.5L3.98223 4.23223L5.5 2Z" 
        stroke="white" 
        strokeWidth="1.6" 
        strokeLinecap="square"
      />
    </svg>
  );
}

export default GemIcon;

