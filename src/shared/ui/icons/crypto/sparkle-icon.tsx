import { SVGProps } from "react";

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none"
      {...props}
    >
      <path 
        d="M1.5 8.5V7.5L6.5 6.5L7.5 1.5H8.5L9.5 6.5L14.5 7.5V8.5L9.5 9.5L8.5 14H7.5L6.5 9.5L1.5 8.5Z" 
        stroke="white" 
        strokeWidth="1.6" 
        strokeLinecap="square"
      />
      <path 
        d="M13.5 1V4" 
        stroke="white" 
        strokeWidth="1.6" 
        strokeLinecap="square"
      />
      <path 
        d="M15.0049 2.49512L12.0049 2.49512" 
        stroke="white" 
        strokeWidth="1.6" 
        strokeLinecap="square"
      />
      <path 
        d="M2.99512 12.0049V14.0049" 
        stroke="white" 
        strokeWidth="1.6" 
        strokeLinecap="square"
      />
      <path 
        d="M4 13L2 13" 
        stroke="white" 
        strokeWidth="1.6" 
        strokeLinecap="square"
      />
    </svg>
  );
}

export default SparkleIcon;

