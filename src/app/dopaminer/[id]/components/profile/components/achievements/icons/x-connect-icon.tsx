interface IXConnectIconProps extends React.ComponentProps<"svg"> {
  type: "disabled" | "enabled";
  className?: string;
}

function XConnectIcon({ type, className, ...props }: IXConnectIconProps) {
  return type === "disabled" ? (
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
        <mask
          id="mask0_4242_114887"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="44"
          width="72"
          height="18"
        >
          <rect y="44" width="72" height="18" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4242_114887)">
          <path
            d="M6 66C6.4 65.6 21 48.5 28 40"
            stroke="white"
            strokeWidth="6.4"
            strokeLinejoin="bevel"
          />
        </g>
        <mask
          id="mask1_4242_114887"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="10"
          width="72"
          height="18"
        >
          <rect
            x="72"
            y="28"
            width="72"
            height="18"
            transform="rotate(180 72 28)"
            fill="#D9D9D9"
          />
        </mask>
        <g mask="url(#mask1_4242_114887)">
          <path
            d="M66 6C65.6 6.4 51 23.5 44 32"
            stroke="white"
            strokeWidth="6.4"
            strokeLinejoin="bevel"
          />
        </g>
        <path
          d="M23.9941 14H9L25.7999 39.0247L30.5578 34.9912L40 49L43.9666 45.5793L53.1964 58H63L48.7246 34.9912L45.2643 38.0163L36.1809 22.8904L31.4229 26.4198L23.9941 14Z"
          fill="white"
          fillOpacity="0.2"
          stroke="white"
          strokeWidth="2.4"
        />
        <path
          d="M61.1699 31.2949L70.8292 28.7067"
          stroke="white"
          strokeWidth="3.2"
          strokeLinejoin="bevel"
        />
        <path
          d="M1.17188 28.707L10.8311 31.2952"
          stroke="white"
          strokeWidth="3.2"
          strokeLinejoin="bevel"
        />
        <path
          d="M61.1719 40.707L70.8311 43.2952"
          stroke="white"
          strokeWidth="3.2"
          strokeLinejoin="bevel"
        />
        <path
          d="M1.16992 43.2949L10.8292 40.7067"
          stroke="white"
          strokeWidth="3.2"
          strokeLinejoin="bevel"
        />
      </g>
    </svg>
  ) : (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <mask
        id="mask0_3853_98731"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="44"
        width="72"
        height="18"
      >
        <rect y="44" width="72" height="18" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3853_98731)">
        <path
          d="M6 66C6.4 65.6 21 48.5 28 40"
          stroke="white"
          strokeWidth="6.4"
          strokeLinejoin="bevel"
        />
      </g>
      <mask
        id="mask1_3853_98731"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="10"
        width="72"
        height="18"
      >
        <rect
          x="72"
          y="28"
          width="72"
          height="18"
          transform="rotate(180 72 28)"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask1_3853_98731)">
        <path
          d="M66 6C65.6 6.4 51 23.5 44 32"
          stroke="white"
          strokeWidth="6.4"
          strokeLinejoin="bevel"
        />
      </g>
      <path
        d="M23.9941 14H9L25.7999 39.0247L30.5578 34.9912L40 49L43.9666 45.5793L53.1964 58H63L48.7246 34.9912L45.2643 38.0163L36.1809 22.8904L31.4229 26.4198L23.9941 14Z"
        fill="white"
        fillOpacity="0.2"
        stroke="white"
        strokeWidth="2.4"
      />
      <path
        d="M61.1699 31.2949L70.8292 28.7067"
        stroke="white"
        strokeWidth="3.2"
        strokeLinejoin="bevel"
      />
      <path
        d="M1.17188 28.707L10.8311 31.2952"
        stroke="white"
        strokeWidth="3.2"
        strokeLinejoin="bevel"
      />
      <path
        d="M61.1719 40.707L70.8311 43.2952"
        stroke="white"
        strokeWidth="3.2"
        strokeLinejoin="bevel"
      />
      <path
        d="M1.16992 43.2949L10.8292 40.7067"
        stroke="white"
        strokeWidth="3.2"
        strokeLinejoin="bevel"
      />
    </svg>
  );
}

export default XConnectIcon;
