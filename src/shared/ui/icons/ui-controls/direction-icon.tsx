interface IDirectionIconProps {
  className?: string;
  direction?: "up" | "down";
}

function DirectionIcon({ className, direction = "up" }: IDirectionIconProps) {
  return (
    <svg
      width="7"
      height="4"
      viewBox="0 0 7 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transform: direction === "up" ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path fill="currentColor" d="M7 0H0L3.5 4L7 0Z" />
    </svg>
  );
}

export default DirectionIcon;
