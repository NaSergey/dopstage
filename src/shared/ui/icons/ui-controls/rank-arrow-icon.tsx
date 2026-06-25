function RankArrowIcon({ className, direction = "up" }: { className?: string; direction?: "up" | "down" }) {
  const stroke = direction === "up" ? "#55FF00" : "#FF4444";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      className={className}
      style={direction === "down" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        d="M1.5 3.5L3.5 1H4.5L6.5 3.5"
        stroke={stroke}
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default RankArrowIcon;

