import { cn } from "../lib/utils/css";
import { Input } from "./input";
import { SearchIcon } from "./icons";

interface SearchInputProps extends React.ComponentProps<"input"> {
  className?: string;
  variant?: 'default' | 'gray';
}

function SearchInput({ className, variant = 'default', ...props }: SearchInputProps) {
  return (
    <Input
      variant={variant}
      type="text"
      icon={<SearchIcon className="text-muted-foreground h-4 w-4" />}
      iconPosition="left"
      clearable
      className={cn("text-white placeholder:text-zinc-600", className)}
      {...props}
    />
  );
}

export default SearchInput;