import { cn } from "../lib/utils/css";
import { MultiplierIcon } from "./icons";
import { OctagonFrame } from "./octagon-frame";
import { cva, type VariantProps } from "class-variance-authority";

const multiplierContentVariants = cva(
  "flex items-center text-base leading-none font-medium px-1.5",
  {
    variants: {
      variant: {
        simple: "justify-between",
        withDivider: "",
        reversed: "",
      },
      colorScheme: {
        purple: "text-white",
        gray: "text-white",
      },
    },
    defaultVariants: {
      variant: "simple",
      colorScheme: "purple",
    },
  },
);

interface IMultiplierProps extends VariantProps<typeof multiplierContentVariants> {
  value: number | null | undefined;
  suffixText?: string;
  className?: string;
  width?: number;
  height?: number;
}

const Divider = ({ className, color }: { className?: string; color: string }) => (
  <svg
    width="2"
    height="12"
    viewBox="0 0 2 12"
    fill="none"
    className={cn("flex-shrink-0", className)}
  >
    <path d="M1 0V12" stroke={color} strokeWidth="1.5" />
  </svg>
);

// Color constants
const COLORS = {
  frame: { gray: "#71717A", purple: "#6314FF" },
  bg: {
    simple: { gray: "#18181B", purple: "#2E1660" },
    splitLeft: { gray: "#18181A", purple: "#2E1660" },
    splitRight: { gray: "#09090B", purple: "#18181A" },
  },
} as const;

function Multiplier({
  value,
  variant = "simple",
  suffixText = "10d",
  colorScheme = "purple",
  className,
  width,
  height = 20,
}: IMultiplierProps) {
  const currentColorScheme = colorScheme ?? "purple";
  const frameColor = COLORS.frame[currentColorScheme];
  const needsSplitBackground = variant === "withDivider" || variant === "reversed";

  const isEmpty = value === null || value === undefined || (typeof value === "number" && isNaN(value));
  const displayValue = isEmpty ? "--" : value;

  // Calculate width
  const valueStr = isEmpty ? "--" : String(value);
  const calculatedWidth =
    width ??
    (variant === "simple" ? 54 : 86) + Math.max(0, valueStr.length - 3) * 8;

  // Background colors
  const bgColors = needsSplitBackground
    ? {
        left: COLORS.bg.splitLeft[currentColorScheme],
        right: COLORS.bg.splitRight[currentColorScheme],
        single: COLORS.bg.splitLeft[currentColorScheme],
      }
    : {
        left: COLORS.bg.simple[currentColorScheme],
        right: COLORS.bg.simple[currentColorScheme],
        single: COLORS.bg.simple[currentColorScheme],
      };

  // Right section component
  const rightSection = (
    <div className="flex items-center gap-[1px] absolute right-[3px] top-1/2 -translate-y-1/2 z-10 flex-shrink-0">
      <Divider color={frameColor} />
      <span className="text-[11px] text-zinc-400">{suffixText}</span>
    </div>
  );

  return (
    <OctagonFrame
      width={calculatedWidth}
      height={height}
      frameColor={frameColor}
      bgColor="transparent"
      className={className}
      contentClassName={multiplierContentVariants({ variant, colorScheme })}
    >
      {/* Background layer */}
      {needsSplitBackground ? (
        <>
          <div
            className="absolute inset-y-0 left-0 z-0"
            style={{
              backgroundColor: bgColors.left,
              width: "71%",
              height: "100%",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 z-0"
            style={{
              backgroundColor: bgColors.right,
              left: "71%",
              width: "29%",
              height: "100%",
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: bgColors.single }}
        />
      )}

      {/* Content */}
      {variant === "simple" ? (
        <>
          <MultiplierIcon className="size-3 flex-shrink-0 relative z-10" />
          <span className="relative -mr-0.5 z-10">{displayValue}</span>
        </>
      ) : variant === "withDivider" ? (
        <>
          <div className="flex items-center relative z-10 flex-1">
            <MultiplierIcon className="size-3 flex-shrink-0" />
            <span className="ml-auto pr-5.5">{displayValue}</span>
          </div>
          {rightSection}
        </>
      ) : (
        <>
          <div className="flex items-center justify-center pr-5.5 relative z-10 flex-1">
            <span className="ml-auto">{displayValue}</span>
            <MultiplierIcon className="size-[0.6rem] flex-shrink-0" />
          </div>
          {rightSection}
        </>
      )}
    </OctagonFrame>
  );
}

export default Multiplier;
