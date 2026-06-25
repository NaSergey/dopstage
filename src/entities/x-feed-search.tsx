import SearchInput from "@/shared/ui/search-input";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils/css";
import { useCallback } from "react";

interface IXFeedSearchProps {
  isLoading: boolean;
  placeholder: string;
  search: string;
  setSearch: (value: string) => void;
  className?: string;
  isDisabled?: boolean;
}

function XFeedSearch({
  isLoading,
  placeholder,
  search,
  setSearch,
  className,
  isDisabled,
}: IXFeedSearchProps) {
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  }, [setSearch]);

  // Show skeleton only on initial load (when search is empty)
  const shouldShowSkeleton = isLoading && search === "";

  return (
    <div
      className={cn(
        "relative max-w-[259px] 2xl:max-w-[402px] w-full z-50 ",
        className,
      )}
    >
      {shouldShowSkeleton ? (
        <Skeleton className="w-full h-8 2xl:h-9 rounded-2xl z-10" />
      ) : (
        <SearchInput
          variant="default"
          value={search}
          onChange={handleSearch}
          placeholder={placeholder}
          disabled={isLoading || isDisabled}
          className="h-8 2xl:h-9"
        />
      )}
    </div>
  );
}

export default XFeedSearch;
