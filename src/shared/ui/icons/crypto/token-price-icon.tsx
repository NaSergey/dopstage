interface TokenPriceIconProps {
  variants: "up" | "down";
  className?: string;
}

function TokenPriceIcon({ className, variants }: TokenPriceIconProps) {
  const color = variants === "up" ? "#55FF00" : "#FF002B";
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_6802_6604)">
        <path
          d="M9.00024 3.0001L10.0001 3.99999V7.99957L4.99998 12.9997L4.00009 12.9997L0.000515046 9.00015L0.000515046 8.00026L4.99998 2.99941L9.00024 3.0001ZM7.5004 3.99999C6.67198 3.99999 5.99987 4.6721 5.99987 5.50052C6.00012 6.32864 6.67157 7.00021 7.49971 7.00036C8.32814 7.00036 9.00024 6.32826 9.00024 5.49983C9.00012 4.67164 8.32857 4.00021 7.5004 3.99999Z"
          fill={color}
          fillOpacity="0.3"
        />
      </g>
      <defs>
        <clipPath id="clip0_6802_6604">
          <rect width="10" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default TokenPriceIcon;

