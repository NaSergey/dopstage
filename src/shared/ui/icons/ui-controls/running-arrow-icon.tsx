interface RunningArrowIconProps {
  variants: "up" | "down";
  className?: string;
}

function RunningArrowIcon({ className, variants }: RunningArrowIconProps) {
  const color = variants === "up" ? "#55FF00" : "#FF002B";
  const rotate = variants === "down" ? "0" : "180";
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M1.5 7L3.75 9.25H4.25L6.5 7" stroke={color} strokeWidth="1.6" />
      <path d="M4 7V2.75" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

export default RunningArrowIcon;

