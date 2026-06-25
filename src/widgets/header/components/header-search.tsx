"use client";

import React from "react";
import { AppImage } from "@/shared/ui/app-image";
import { cn } from "@/shared/lib/utils/css";
import Search from "@/shared/ui/search-input";
import { rqClient } from "@/shared/api/instance";
import useDebounce from "@/shared/hooks/useDebounce";
import { VerifiedIcon } from "@/shared/ui/icons";
import ChevronIcon from "@/shared/ui/icons/ui-controls/shevron-icon";
import { AppLink } from "@/shared/ui/app-link";
import { formatK } from "@/shared/lib/format/formatK";
import { Skeleton } from "@/shared/ui/skeleton";
import { ApiComponents } from "@/shared/api/schema";
import HighlightMatches from "@/shared/ui/highlight-matches";

const debounceTimeout = 1000;

type TYapperSearchResponse = ApiComponents["YapperSearchResponse"];
type TProgramSearchResponse = ApiComponents["ProgramSearchResponse"];
type TTweetSearchResponse = ApiComponents["TweetSearchResponse"];

type TGlobalSearchResponse =
  | TYapperSearchResponse
  | TProgramSearchResponse
  | TTweetSearchResponse;

const MAX_ITEMS_TO_SHOW = 2;

export default function HeaderSearch({ className }: { className?: string }) {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, debounceTimeout);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const isUserWriting =
    search.length !== debouncedSearch.length && search.length > 0;

  const { data, isLoading } = rqClient.useQuery(
    "get",
    "/api/v1/common/search",
    {
      params: {
        query: { query: debouncedSearch },
      },
    },
    {
      enabled: Boolean(debouncedSearch),
      keepPreviousData: true,
      select: (result: TGlobalSearchResponse[]) => {
        return result.reduce(
          (
            acc: {
              yappers: TYapperSearchResponse[];
              programs: TProgramSearchResponse[];
              tweets: TTweetSearchResponse[];
            },
            item,
          ) => {
            if (item["tag"] === "yapper") {
              acc.yappers.push(item as TYapperSearchResponse);
            } else if (item["tag"] === "program") {
              acc.programs.push(item as TProgramSearchResponse);
            } else if (item["tag"] === "tweet") {
              acc.tweets.push(item as TTweetSearchResponse);
            }
            return acc;
          },
          { yappers: [], programs: [], tweets: [] },
        );
      },
    },
  );

  const notFound =
    data?.tweets.length === 0 &&
    data?.yappers.length === 0 &&
    data?.programs.length === 0;

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-[400px]", className)}>
      <Search
        variant="gray"
        placeholder="Creators, subnets, keywords"
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-zinc-800 shadow-xl overflow-hidden z-[300]">
          <div className="max-h-[320px] overflow-y-auto p-3 flex flex-col gap-3">
            {isLoading || isUserWriting ? (
              <ul className="flex flex-col gap-6">
                <li className="w-full flex items-center gap-3">
                  <Skeleton className="size-4 mask-octagon bg-zinc-700 shrink-0" />
                  <Skeleton className="w-full h-4 bg-zinc-700" />
                </li>
                <li className="w-full flex items-center gap-3">
                  <Skeleton className="size-4 mask-octagon bg-zinc-700 shrink-0" />
                  <Skeleton className="w-full h-4 bg-zinc-700" />
                </li>
              </ul>
            ) : notFound ? (
              <div className="text-zinc-500">
                <p className="text-sm">Nothing found:(</p>
                <p className="text-sm text-zinc-500">
                  Please refine your search...
                </p>
              </div>
            ) : (
              <>
                {data && data.tweets.length > 0 && (
                  <SearchContainer title={"Tweets"} items={data.tweets}>
                    {(items) => (
                      <ul className="flex flex-col">
                        {items.map((item, idx) => (
                          <li key={item.id} className="w-full">
                            <AppLink href={item.twitter_link} external>
                              <div className="flex items-start gap-3 w-full">
                                <AppImage
                                  src={item.logo}
                                  alt={item.name}
                                  width={16}
                                  height={16}
                                  className="size-4 mask-octagon mt-4"
                                />
                                <div
                                  className={cn(
                                    "w-full py-3",
                                    idx !== items.length - 1
                                      ? "border-b border-zinc-700"
                                      : "",
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "flex items-center gap-1 w-full",
                                    )}
                                  >
                                    <span className="truncate">
                                      <HighlightMatches
                                        text={item.name}
                                        query={search}
                                      />
                                    </span>
                                    {item.is_authenticated && (
                                      <VerifiedIcon className="size-4" />
                                    )}
                                    <span className="font-semibold">
                                      <HighlightMatches
                                        text={item.twitter_handle}
                                        query={search}
                                      />
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-400 line-clamp-2">
                                    <HighlightMatches
                                      text={item.content}
                                      query={search}
                                    />
                                  </p>
                                </div>
                              </div>
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SearchContainer>
                )}

                {data && data.yappers.length > 0 && (
                  <SearchContainer title={"Creators"} items={data.yappers}>
                    {(items) => (
                      <ul className="flex flex-col">
                        {items.map((item, idx) => (
                          <li key={item.id}>
                            <AppLink href={`/dopaminer/${item.id}`}>
                              <div className="flex items-center gap-3 w-full">
                                <AppImage
                                  src={item.logo}
                                  alt={item.name}
                                  width={16}
                                  height={16}
                                  className="size-4 mask-octagon"
                                />
                                <div
                                  className={cn(
                                    "flex items-center gap-1 w-full py-3",
                                    idx !== items.length - 1
                                      ? "border-b border-zinc-700"
                                      : "",
                                  )}
                                >
                                  <span className="truncate">
                                    <HighlightMatches
                                      text={item.name}
                                      query={search}
                                    />
                                  </span>
                                  {item.is_authenticated && (
                                    <VerifiedIcon className="size-4" />
                                  )}
                                  <span className="font-semibold">
                                    <HighlightMatches
                                      text={item.twitter_handle}
                                      query={search}
                                    />
                                  </span>
                                </div>
                              </div>
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SearchContainer>
                )}

                {data && data.programs.length > 0 && (
                  <SearchContainer title={"Programs"} items={data.programs}>
                    {(items) => (
                      <ul className="flex flex-col">
                        {items.map((item, idx) => (
                          <li key={item.id}>
                            <AppLink href={`/subnet/${item.id}`}>
                              <div className="flex items-center gap-3 w-full">
                                <AppImage
                                  src={item.logo}
                                  alt={item.name}
                                  width={16}
                                  height={16}
                                  className="size-4 mask-octagon"
                                />
                                <div
                                  className={cn(
                                    "flex justify-between w-full items-center py-3",
                                    idx !== items.length - 1
                                      ? "border-b border-zinc-700"
                                      : "",
                                  )}
                                >
                                  <div className={"flex items-center gap-1"}>
                                    <span className="truncate">
                                      <HighlightMatches
                                        text={item.name}
                                        query={search}
                                      />
                                    </span>
                                  </div>
                                  <span className="text-xs text-zinc-500">
                                    {formatK(item.daily_tdd ?? 0)}
                                  </span>
                                </div>
                              </div>
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SearchContainer>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SearchContainerProps<T> {
  children: (items: T[]) => React.ReactNode;
  title: string;
  items: T[];
}

const SearchContainer = <T,>({
  children,
  title,
  items,
}: SearchContainerProps<T>) => {
  const [expanded, setExpanded] = React.useState(false);
  const totalItems = Array.isArray(items) ? items.length : 0;
  const visibleItems = expanded ? items : items.slice(0, MAX_ITEMS_TO_SHOW);

  return (
    <div>
      <h4 className="text-xs leading-normal text-white/60 mb-1">
        {title} ({items.length})
      </h4>
      {children(visibleItems)}
      {totalItems > MAX_ITEMS_TO_SHOW && (
        <button
          className="w-full mt-2 h-6 bg-zinc-900 text-sm text-center text-white/60 hover:text-white transition-colors cursor-pointer"
          onClick={() => setExpanded((p) => !p)}
        >
          <span className="flex items-center gap-2 justify-center">
            {expanded ? "See less" : "See all"}{" "}
            <ChevronIcon
              variants={expanded ? "down" : "up"}
              className={cn("size-3", !expanded && "translate-y-0.5")}
            />
          </span>
        </button>
      )}
    </div>
  );
};
