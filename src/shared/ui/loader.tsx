function Loader({
  className,
  color = "#6314ff",
  dotSize = 10,
}: {
  className?: string;
  color?: string;
  dotSize?: number;
}) {
  const containerClass = ["loader4", className].filter(Boolean).join(" ");

  return (
    <div className={containerClass} aria-label="loading" role="status">
      <span />
      <span />
      <span />
      <style jsx>{`
        .loader4 {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loader4 span {
          display: inline-block;
          width: ${dotSize}px;
          height: ${dotSize}px;
          border-radius: 100%;
          background-color: ${color};
          margin: ${dotSize}px ${dotSize / 2}px;
          opacity: 0;
        }
        .loader4 span:nth-child(1) {
          animation: loader4-opacitychange 1s ease-in-out infinite;
        }
        .loader4 span:nth-child(2) {
          animation: loader4-opacitychange 1s ease-in-out 0.33s infinite;
        }
        .loader4 span:nth-child(3) {
          animation: loader4-opacitychange 1s ease-in-out 0.66s infinite;
        }
        @keyframes loader4-opacitychange {
          0%,
          100% {
            opacity: 0;
          }
          60% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Loader;
