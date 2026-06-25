import { cn } from "@/shared/lib/utils/css";

interface IRejectIconProps extends React.ComponentProps<"svg"> {
  type: "disabled" | "enabled";
  className?: string;
}

function RejectIcon({ className, type, ...props }: IRejectIconProps) {
  return (
    <svg
      width={72}
      height={72}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
      {...props}
    >
      {type === "disabled" ? (
        <>
          <g clipPath="url(#clip0_4242_114900)">
            <g opacity="0.2">
              <path
                d="M14 45.5L11 34L12 14.5L20 4.5L31 2H41L52 4.5L60 14.5L61 34L58 45.5L54 47L44.5 44L46 53L44 55H28L26 53L27.5 44L18 47L14 45.5Z"
                fill="#D5D5D5"
              />
              <path
                opacity="0.3"
                d="M16 38.5L13 34L12 27L16.5 24.5L36 29L55.5 24.5L60 27L59 34L56 38.5L49.5 40.5L40 38L36 36L32 38L22.5 40.5L16 38.5Z"
                fill="black"
              />
              <path
                d="M25.5 66.5L28.5 70H43.5L46.5 66.5L45.5 62H26.5L25.5 66.5Z"
                fill="#D5D5D5"
              />
              <path
                d="M19 50L23 64"
                stroke="#D5D5D5"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M53 50L49 64"
                stroke="#D5D5D5"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M41 16L40 22H32L31 16"
                stroke="black"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M48.5 8L55 15"
                stroke="black"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M34.5 40L33 49"
                stroke="black"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M37.5 40L39 49"
                stroke="black"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M34 56V61"
                stroke="#D5D5D5"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M30 56V61"
                stroke="#D5D5D5"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M38 56V61"
                stroke="#D5D5D5"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M42 56V61"
                stroke="#D5D5D5"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M32 31L16 27.5L17 36.5L22.5 38L31 36L32 31Z"
                fill="black"
              />
              <path
                d="M40 31L56 27.5L55 36.5L49.5 38L41 36L40 31Z"
                fill="black"
              />
              <path
                d="M32 31L16 27.5L17 36.5L22.5 38L31 36L32 31Z"
                stroke="black"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M40 31L56 27.5L55 36.5L49.5 38L41 36L40 31Z"
                stroke="black"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <path
                d="M32.0896 3.52414L28.7866 8.08453L20.4657 10.0898L15.4478 7.53474L18.7509 2.97435L27.0718 0.969051L32.0896 3.52414Z"
                stroke="#18181B"
                strokeWidth="3.2"
                strokeLinejoin="bevel"
              />
              <circle cx="24" cy="31" r="3" fill="white" />
              <circle cx="48" cy="31" r="3" fill="white" />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_4242_114900">
              <rect width="72" height="72" fill="white" />
            </clipPath>
          </defs>
        </>
      ) : (
        <>
          <path
            d="M14 45.5L11 34L12 14.5L20 4.5L31 2H41L52 4.5L60 14.5L61 34L58 45.5L54 47L44.5 44L46 53L44 55H28L26 53L27.5 44L18 47L14 45.5Z"
            fill="#B6ABCC"
          />
          <path
            opacity="0.3"
            d="M16 38.5L13 34L12 27L16.5 24.5L36 29L55.5 24.5L60 27L59 34L56 38.5L49.5 40.5L40 38L36 36L32 38L22.5 40.5L16 38.5Z"
            fill="black"
          />
          <path
            d="M25.5 66.5L28.5 70H43.5L46.5 66.5L45.5 62H26.5L25.5 66.5Z"
            fill="#B6ABCC"
          />
          <path
            d="M19 50L23 64"
            stroke="#B6ABCC"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M53 50L49 64"
            stroke="#B6ABCC"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M41 16L40 22H32L31 16"
            stroke="black"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M48.5 8L55 15"
            stroke="black"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M34.5 40L33 49"
            stroke="black"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M37.5 40L39 49"
            stroke="black"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M34 56V61"
            stroke="#B6ABCC"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M30 56V61"
            stroke="#B6ABCC"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M38 56V61"
            stroke="#B6ABCC"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M42 56V61"
            stroke="#B6ABCC"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path d="M32 31L16 27.5L17 36.5L22.5 38L31 36L32 31Z" fill="black" />
          <path d="M40 31L56 27.5L55 36.5L49.5 38L41 36L40 31Z" fill="black" />
          <path
            d="M32 31L16 27.5L17 36.5L22.5 38L31 36L32 31Z"
            stroke="black"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <path
            d="M40 31L56 27.5L55 36.5L49.5 38L41 36L40 31Z"
            stroke="black"
            strokeWidth="3.2"
            strokeLinejoin="bevel"
          />
          <mask
            id="mask0_3853_98738"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="11"
            y="2"
            width="50"
            height="53"
          >
            <path
              d="M14 45.5L11 34L12 14.5L20 4.5L31 2H41L52 4.5L60 14.5L61 34L58 45.5L54 47L44.5 44L46 53L44 55H28L26 53L27.5 44L18 47L14 45.5Z"
              fill="#B6ABCC"
            />
          </mask>
          <g mask="url(#mask0_3853_98738)">
            <path
              d="M15.4478 7.53465L20.4657 10.0897L28.7866 8.08444L32.0896 3.52405L27.0718 0.968959"
              stroke="#18181B"
              strokeWidth="3.2"
              strokeLinejoin="bevel"
            />
          </g>
          <circle cx="24" cy="31" r="3" fill="#FF002B" />
          <circle cx="48" cy="31" r="3" fill="#FF002B" />
        </>
      )}
    </svg>
  );
}

export default RejectIcon;
