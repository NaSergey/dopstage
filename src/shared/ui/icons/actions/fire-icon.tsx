import { forwardRef } from "react";

// Use type alias instead of empty interface: no-empty-object-type forbids interfaces
// that add no members beyond their supertype.
type FireIconProps = React.SVGProps<SVGSVGElement>;

const FireIcon = forwardRef<SVGSVGElement, FireIconProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width="7"
        height="9"
        viewBox="0 0 7 9"
        fill="none"
        className={className}
        {...props}
      >
        <path
          d="M2.8125 0L3.75 1.5625L5.33471 2.79029L6.25 5L5.33471 7.20971L3.125 8.125L0.915291 7.20971L0 5L0.457646 3.89515L1.875 4.6875L2.5 4.0625L1.875 2.8125L1.8639 1.39515L2.8125 0Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

FireIcon.displayName = "FireIcon";

export default FireIcon;