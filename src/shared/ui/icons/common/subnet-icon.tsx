import { SVGProps } from "react";

function SubnetIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <g clipPath="url(#clip0_9955_15970)">
      <path d="M16 2V14L14 16H2L0 14V2L2 0H14L16 2ZM3.0498 3.0498L1 8L3.0498 12.9502L8 15L12.9502 12.9502L15 8L12.9502 3.0498L8 1L3.0498 3.0498Z" fill="white"/>
      <path d="M10.5 5H8L6.5 6.5L8 8" stroke="white" strokeWidth="1.6"/>
      <path d="M8 8L9.5 9.5L8 11H5.5" stroke="white" strokeWidth="1.6"/>
    </g>
    <defs>
      <clipPath id="clip0_9955_15970">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
  );
}

export default SubnetIcon;

