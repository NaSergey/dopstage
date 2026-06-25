import { formatK } from "@/shared/lib/format/formatK";
import Sparkline from "@/shared/ui/sparkline/sparkline";
import DopValue from "@/shared/ui/dops-value";

interface ReceptorLineProps {
  title: React.ReactNode;
  value: number;
  data: number[];
  isDop?: boolean;
}

function ReceptorLine({ title, value, data, isDop }: ReceptorLineProps) {
  const formatted = formatK(value, 0);

  return (
    <div className="grid grid-cols-2 gap-1">
      <div>
        <h5 className="text-xs leading-normal text-zinc-500 whitespace-nowrap">{title}</h5>
        <span className="text-sm leading-normal text-white truncate">
          {isDop ? <DopValue>{formatted}</DopValue> : formatted}
        </span>
      </div>
      <div>
        <Sparkline data={data} width={75} height={20} paddingX={2} paddingY={2} />
      </div>
    </div>
  );
}

export default ReceptorLine;
