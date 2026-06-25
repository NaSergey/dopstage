import { DopIcon } from "./icons";
import { cn } from "../lib/utils/css";

interface DopValueProps {
  className?: string;
  iconClassName?: string;
}

function DopValue({ className, iconClassName, children }: React.PropsWithChildren<DopValueProps>) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {children}
      <DopIcon className={cn(iconClassName)} />
    </div>
  );
}

export default DopValue;