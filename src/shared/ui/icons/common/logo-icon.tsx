function LogoIcon({
  className,
  ...props
}: React.ComponentProps<"svg"> & { width?: number; height?: number }) {
  return (
    <svg
      width="111"
      height="36"
      viewBox="0 0 111 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M65.2812 18L2.21094 35.7806L2.21094 0.219414L65.2812 18Z"
        fill="#6314FF"
      />
      <path
        d="M65.2812 18L17.6094 35.7806L17.6094 0.219414L65.2812 18Z"
        fill="#6314FF"
      />
      <path
        d="M65.2812 18L40.1797 35.7806L40.1797 0.219415L65.2812 18Z"
        fill="#6314FF"
      />
      <path
        d="M45.8438 18L108.914 35.7806L108.914 0.219414L45.8438 18Z"
        fill="#6314FF"
      />
      <path
        d="M45.8438 18L93.5156 35.7806L93.5156 0.219414L45.8438 18Z"
        fill="#6314FF"
      />
      <path
        d="M45.8438 18L70.9453 35.7806L70.9453 0.219415L45.8438 18Z"
        fill="#6314FF"
      />
    </svg>
  );
}

export default LogoIcon;
