import { AppLink } from "./app-link";
import { MaximizeIcon } from "./icons";
import { cn } from "@/shared/lib/utils/css";

interface IMaximizeLinkProps {
  href: string;
  className?: string;
}

function MaximizeLink({ href, className }: IMaximizeLinkProps) {
  return (
    <AppLink
      href={href}
      className={cn("absolute top-0 right-1 size-6 cursor-pointer ", className)}
    >
      <div className="size-6 flex items-center justify-center bg-zinc-900">
        <MaximizeIcon className="text-zinc-600 hover:text-white transition-colors" />
      </div>
    </AppLink>
  );
}

export default MaximizeLink;
