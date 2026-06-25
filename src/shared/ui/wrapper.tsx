import { cn } from "@/shared/lib/utils/css";

function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(" mx-auto w-full px-4 ", className)}>{children}</div>
  );
}

export default Wrapper;
