import { CopyIcon, XIcon } from "@/shared/ui/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils/css";
import copyToClipboard from "@/shared/lib/utils/copy-to-clipboard";

interface ICopyProps {
  twitter_url?: string;
  dexscreener_url?: string;
}

function Copy({ twitter_url, dexscreener_url }: ICopyProps) {
  const contractAddress = dexscreener_url?.split("/")?.pop()?.split("-")?.pop();

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success("Copied to clipboard");
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none">
        <button
          className={cn(
            "inline-flex items-center gap-2 hover:text-white cursor-pointer",
            "aria-[expanded=true]:text-white",
          )}
          aria-label="Copy"
        >
          <CopyIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[140px] py-2 px-3 bg-zinc-800 flex justify-center mt-2 left-0"
        align="start"
      >
        <DropdownMenuGroup className="w-full">
          {contractAddress && (
            <DropdownMenuItem
              onSelect={() => handleCopy(contractAddress)}
              className="flex items-center justify-between text-sm leading-none text-white cursor-pointer hover:text-white/80 transition-colors py-2.5 outline-none"
            >
              Copy address
              <CopyIcon className="w-3 h-3 text-zinc-500" />
            </DropdownMenuItem>
          )}
          {contractAddress && twitter_url && (
            <DropdownMenuSeparator className="h-[1px] bg-zinc-700 my-1" />
          )}

          {twitter_url && (
            <DropdownMenuItem
              onSelect={() => handleCopy(twitter_url)}
              className="flex items-center justify-between text-sm leading-none text-white cursor-pointer hover:text-white/80 transition-colors py-2.5 outline-none"
            >
              Copy Xhandle
              <XIcon className="w-3 h-3 text-zinc-500" />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Copy;
