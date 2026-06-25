export type ProgressBarProps = {
  value: number;
  height?: number;
  width?: number | string;
  stripeGap?: number;
  variant?: "default" | "compact" | "dense";
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function ProgressBar({
  value,
  height = 16,
  width,
  stripeGap,
  variant = "default",
}: ProgressBarProps) {
  const v = clamp01(value);
  const percent = v * 100;
  const w = typeof width === "number" ? `${width}px` : (width ?? "100%");
  
  // Three states: red (0-33%), yellow (33-66%), green (66-100%)
  const state = v < 0.33 ? "red" : v < 0.66 ? "yellow" : "green";

  //  stripeGap
  const gapMap = {
    default: 3,
    compact: 2,
    dense: 1,
  };

  const actualGap = stripeGap ?? gapMap[variant];

  // Palette with three states (red, yellow, green)
  const palette =
    state === "green"
      ? { bg: "#09150b", fill: "#14451f", stripe: "rgba(78,255,0,.9)" }
      : state === "yellow"
      ? { bg: "#161209", fill: "#453f14", stripe: "rgba(255,234,0,.9)" }
      : { bg: "#1e060b", fill: "#6b1220", stripe: "rgba(255,0,64,.9)" };

  // Stripe look
  const stripeWidth = 3; // px
  const stripeImage = `repeating-linear-gradient(90deg, ${palette.stripe}, ${palette.stripe} ${stripeWidth}px, transparent ${stripeWidth}px, transparent ${stripeWidth + actualGap}px)`;

  return (
    <div className="relative" style={{ width: w }}>
      <div
        className="relative h-[var(--h)] shadow-lg"
        style={{
          ["--h" as string]: `${height}px`,
          backgroundColor: palette.bg,
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <div
          className="absolute left-0 top-0 h-full"
          style={{ width: `${percent}%`, backgroundColor: palette.fill }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundImage: stripeImage }}
          />
        </div>
      </div>
    </div>
  );
}
