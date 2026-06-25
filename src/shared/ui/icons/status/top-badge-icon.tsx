import { SVGProps } from "react";

export const TopBadgeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="8" 
    viewBox="0 0 14 8" 
    fill="none" 
    {...props}
  >
    <rect width="14" height="8" fill="#FF002B"/>
    <path d="M2.5 6.00003V2" stroke="black" strokeWidth="1.2" strokeLinecap="square"/>
    <path d="M10 6.00003V4.5M10 4.5V2H11.5L12.5 3.25L11.5 4.5H10Z" stroke="black" strokeWidth="1.2" strokeLinecap="square"/>
    <path d="M1.5 2H3.5" stroke="black" strokeWidth="1.2" strokeLinecap="square"/>
    <path d="M5 3L6.5 2L8 3V5.5L6.5 6.5L5 5.5V3Z" stroke="black" strokeWidth="1.2" strokeLinecap="square"/>
  </svg>
);

