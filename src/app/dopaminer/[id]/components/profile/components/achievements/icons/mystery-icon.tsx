interface IMysteryIconProps extends React.ComponentProps<"svg"> {
  type: "enabled" | "disabled";
  className?: string;
}

function MysteryIcon({ type, className, ...props }: IMysteryIconProps) {
  switch (type) {
    case "enabled":
      return (
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path d="M18 63L21 52H51L54 63L44.5 69H27.5L18 63Z" fill="#2B0575" />
          <path d="M36 2L53.6336 7.72949L64.5317 22.7295V41.2705L53.6336 56.2705L36 62L18.3664 56.2705L7.4683 41.2705V22.7295L18.3664 7.72949L36 2Z" fill="#6314FF" />
          <path d="M36 4L50.1068 8.58359L58.8254 20.5836V35.4164L50.1068 47.4164L36 52L21.8932 47.4164L13.1746 35.4164V20.5836L21.8932 8.58359L36 4Z" fill="#7E3DFF" />
          <path d="M36 6L45.4046 9.05573L51.2169 17.0557V26.9443L45.4046 34.9443L36 38L26.5954 34.9443L20.7831 26.9443V17.0557L26.5954 9.05573L36 6Z" fill="#B28BFF" />
          <path d="M14 17L9 16.5V15.5L14 15L14.5 5H15.5L16 15L21 15.5V16.5L16 17L15.5 27H14.5L14 17Z" fill="white" />
          <path d="M54 44L50 43.5V42.5L54 42L54.5 34H55.5L56 42L60 42.5V43.5L56 44L55.5 52H54.5L54 44Z" fill="white" />
          <path d="M24.4971 27.9482L25.958 42.0732L34.0869 43.5078V44.4922L25.958 45.9258L24.4971 60.0518H23.5029L22.041 45.9258L13.9131 44.4922V43.5078L22.041 42.0732L23.5029 27.9482H24.4971Z" fill="#FFFF00" stroke="#FFFF00" />
          <path d="M64.0479 15.498L48.9346 16.96L47.4941 26.0781L46.5059 26.0781L45.0664 16.96L29.9521 15.498L29.9521 14.502L45.0664 13.0391L46.5059 3.92187L47.4941 3.92187L48.9346 13.0391L64.0479 14.502L64.0479 15.498Z" fill="#FFFF00" stroke="#FFFF00" />
          <rect x="58" y="6" width="4" height="4" fill="white" />
          <rect x="63" y="55" width="4" height="4" fill="white" />
          <rect x="42" y="42" width="4" height="4" fill="white" />
          <rect x="5" y="41" width="4" height="4" fill="white" />
          <rect x="33" y="22" width="4" height="4" fill="white" />
        </svg>
      );
    case "disabled":
      return (
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <g opacity="0.2">
            <path d="M18 63L21 52H51L54 63L44.5 69H27.5L18 63Z" fill="#303030" />
            <path d="M36 2L53.6336 7.72949L64.5317 22.7295V41.2705L53.6336 56.2705L36 62L18.3664 56.2705L7.4683 41.2705V22.7295L18.3664 7.72949L36 2Z" fill="#535353" />
            <path d="M36 4L50.1068 8.58359L58.8254 20.5836V35.4164L50.1068 47.4164L36 52L21.8932 47.4164L13.1746 35.4164V20.5836L21.8932 8.58359L36 4Z" fill="#7B7B7B" />
            <path d="M36 6L45.4046 9.05573L51.2169 17.0557V26.9443L45.4046 34.9443L36 38L26.5954 34.9443L20.7831 26.9443V17.0557L26.5954 9.05573L36 6Z" fill="#B9B9B9" />
            <path d="M14 17L9 16.5V15.5L14 15L14.5 5H15.5L16 15L21 15.5V16.5L16 17L15.5 27H14.5L14 17Z" fill="white" />
            <path d="M54 44L50 43.5V42.5L54 42L54.5 34H55.5L56 42L60 42.5V43.5L56 44L55.5 52H54.5L54 44Z" fill="white" />
            <path d="M24.4971 27.9482L25.958 42.0732L34.0869 43.5078V44.4922L25.958 45.9258L24.4971 60.0518H23.5029L22.041 45.9258L13.9131 44.4922V43.5078L22.041 42.0732L23.5029 27.9482H24.4971Z" fill="white" stroke="white" />
            <path d="M64.0479 15.498L48.9346 16.96L47.4941 26.0781L46.5059 26.0781L45.0664 16.96L29.9521 15.498L29.9521 14.502L45.0664 13.0391L46.5059 3.92187L47.4941 3.92187L48.9346 13.0391L64.0479 14.502L64.0479 15.498Z" fill="white" stroke="white" />
            <rect x="58" y="6" width="4" height="4" fill="white" />
            <rect x="63" y="55" width="4" height="4" fill="white" />
            <rect x="42" y="42" width="4" height="4" fill="white" />
            <rect x="5" y="41" width="4" height="4" fill="white" />
            <rect x="33" y="22" width="4" height="4" fill="white" />
          </g>
        </svg>
      );
  }
}

export default MysteryIcon;

