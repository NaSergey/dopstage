import { cn } from "@/shared/lib/utils/css";
import FireIcon from "@/shared/ui/icons/actions/fire-icon";
import ProgressBar from "@/shared/ui/progress-bar";

function ProgramDuration({
  lifetime_remain,
  max,
  className,
}: {
  lifetime_remain: number;
  max: number;
  className?: string;
}) {
  const value = lifetime_remain / max;
  const state = value < 0.33 ? "red" : value < 0.66 ? "yellow" : "green";
  const palette =
    state === "green"
      ? { bg: "#0e1f12", text: "rgba(78,255,0,.9)" }
      : state === "yellow"
      ? { bg: "#1f1a0e", text: "rgba(255,234,0,.9)" }
      : { bg: "#2b0a10", text: "rgba(255,0,64,.9)" };

  return (
    <div
      className={cn("flex flex-col justify-center gap-0.5 px-4 w-[168px] flex-shrink-0", className)}
      style={{ backgroundColor: palette.bg }}
    >
      <div className="flex items-center justify-end gap-1 text-xs" style={{ color: palette.text }}>
        <span>{Math.round(value * 100) === 0 ? <><span className="inline-block -translate-y-px pr-0.5">&gt;</span>1</> : Math.round(value * 100)} %</span>
        <FireIcon className="w-[8px] h-[12px] flex-shrink-0" />
        <span>Reward Rate</span>
      </div>
      <ProgressBar value={value === 0 ? 0.01 : value} height={16} width={136} variant="dense" />
    </div>
  );
}

export default ProgramDuration;
