import React from "react";

interface XCheckIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const XCheckIcon: React.FC<XCheckIconProps> = ({
  className = "",
  width = 20,
  height = 20,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.7354 2.64307L17.6865 4.99951L16.7354 7.35693L14.4385 8.3335L12.1426 7.35693L11.1914 4.99951L12.1426 2.64307L14.4385 1.6665L16.7354 2.64307ZM13.9668 4.94287L13.3594 4.31982L12.2129 5.43701L13.3936 6.64893L13.9668 7.23682L14.54 6.64893L16.6064 4.52783L16.0332 3.96924L15.4609 3.41064L13.9668 4.94287Z"
        fill="currentColor"
      />
      <path
        d="M7.52385 3.3335H3.33337L12.4762 16.6668H16.6667L7.52385 3.3335Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7.44733 11.6668L2.5 17.5002H3.81929L8.33333 12.1777L9.16667 11.2502L8.33333 10.5835L7.44733 11.6668Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default XCheckIcon;
