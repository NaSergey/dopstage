"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ShevronIcon } from "@/shared/ui/icons/index";
import { AppImage } from "@/shared/ui/app-image";
import { FrameSurface } from "@/shared/ui/frame-surface";
import { hexToRgba, generateDarkShade } from "@/shared/lib/utils/color";
import HighlightMatches from "./highlight-matches";

type AppSelectOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: string | React.ReactElement | null;
  isDisabled?: boolean;
};

interface AppSelectProps<T extends string> {
  options: readonly AppSelectOption<T>[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: T) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  isDisabled?: boolean;
  frameHeight?: number;
  frameColor?: string;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  emptySearchText?: string;
}

export default function AppSelect<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  className,
  triggerClassName,
  contentClassName,
  isDisabled,
  frameHeight = 36,
  frameColor = "#6314FF",
  isSearchable = false,
  searchPlaceholder = "Search…",
  emptySearchText = "Nothing found",
}: AppSelectProps<T>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const contentClipPath = React.useMemo(
    () =>
      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 7.5px) calc(100% - 4.25px), calc(100% - 19px) 100%, 19px 100%, 7.5px calc(100% - 4.25px), 0 calc(100% - 14px))",
    [],
  );

  const selected = options.find((o) => o.value === value);
  const filteredOptions = React.useMemo(() => {
    if (!isSearchable) return options;

    const q = searchValue.trim().toLowerCase();
    if (!q) return options;

    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [isSearchable, options, searchValue]);

  const pathClassName = cn(
    "transition-colors",
    isOpen
      ? "duration-0"
      : "duration-200 group-hover:stroke-[var(--frame-hover-color)]",
  );

  const glowOuterColor = hexToRgba(frameColor, 0.3);
  const glowInnerColor = hexToRgba(frameColor, 0.5);
  const hoverBgColor = generateDarkShade(frameColor, 0.3);

  return (
    <div
      className={cn(
        "relative inline-block w-full overflow-visible",
        className,
      )}
    >
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearchValue("");
        }}
        disabled={isDisabled}
      >
        <SelectTrigger
          ref={triggerRef}
          className={cn(
            "group relative bg-transparent border-0 p-0 inline-block h-auto w-full cursor-pointer focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-transparent focus-visible:shadow-none",
            triggerClassName,
          )}
          style={
            {
              height: frameHeight,
              "--frame-hover-color": "#6314FF",
              "--frame-text-hover-color": "#6314FF",
            } as React.CSSProperties
          }
        >
          <FrameSurface
            height={frameHeight}
            inset={12}
            mode={isOpen ? "openBottom" : "closed"}
            strokeColor={(context) => {
              if (isOpen) return "#000000";
              if (context.isHovered) return "#6314FF";
              return "#27272A";
            }}
            pathClassName={pathClassName}
            contentElement={null}
            renderUnderlay={(context) => (
              <>
                {/* Outer Glow */}
                <div
                  className="absolute top-[-8px] left-[-8px] right-[-8px] bottom-[-8px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-70"
                  style={{ backgroundColor: glowOuterColor }}
                  aria-hidden="true"
                />
                {/* Inner Glow */}
                <div
                  className="absolute top-[-3px] left-[-3px] right-[-3px] bottom-[-3px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-80"
                  style={{ backgroundColor: glowInnerColor }}
                  aria-hidden="true"
                />
                {/* Black Background */}
                <div
                  className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-100 transition-all duration-300 group-hover:opacity-100 group-active:bg-white group-active:opacity-100"
                  style={context.clipPathStyle}
                  aria-hidden="true"
                />
              </>
            )}
          >
            {/* Content */}
            <div
              className="relative z-10 flex items-center justify-between w-full h-full px-4 text-foreground transition-colors group-hover:text-[var(--frame-text-hover-color)] group-active:text-black"
              style={
                {
                  "--frame-text-hover-color": "#6314FF",
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-2 truncate">
                {selected ? (
                  <>
                    {selected.icon && selected.icon !== null &&
                      (React.isValidElement(selected.icon) ? (
                        selected.icon
                      ) : typeof selected.icon === "string" ||
                        typeof selected.icon === "object" ? (
                        <AppImage
                          src={selected.icon}
                          alt={selected.label}
                          className="rounded-full"
                          width={20}
                          height={20}
                        />
                      ) : null)}
                    <span className="truncate">{selected.label}</span>
                  </>
                ) : (
                  <SelectValue placeholder={placeholder} />
                )}
              </div>
              <ShevronIcon
                variants="up"
                className="shrink-0 transition-transform group-data-[state=open]:rotate-360 w-[7px] h-[5px]"
              />
            </div>
          </FrameSurface>
        </SelectTrigger>

        <SelectContent
          className={cn(
            "bg-black text-sm text-white border-none rounded-none leading-sm p-0",
            "shadow-lg shadow-black/50 overflow-hidden origin-top will-change-transform data-[state=closed]:scale-y-0 data-[state=open]:scale-y-100 data-[side=bottom]:translate-y-0",
            "[&_[data-radix-select-viewport]]:p-0",
            contentClassName,
          )}
          style={{
            clipPath: isOpen ? contentClipPath : undefined,
            WebkitClipPath: isOpen ? contentClipPath : undefined,
            "--hover-bg-color": hoverBgColor,
          } as React.CSSProperties}
        >
          {isSearchable && (
            <div className="sticky top-0 z-10 bg-black p-2 border-b border-white/10">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full h-9 px-3 text-white placeholder:text-white/40 outline-none"
                onKeyDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.isDisabled}
                className="transition-all cursor-pointer w-full !px-4 !py-2 data-[highlighted]:bg-[var(--hover-bg-color)]"
              >
                <div className="flex items-center gap-2">
                  {option.icon && option.icon !== null &&
                    (React.isValidElement(option.icon) ? (
                      option.icon
                    ) : (
                      <AppImage
                        src={option.icon}
                        alt={option.label}
                        className="rounded-full"
                        width={20}
                        height={20}
                      />
                    ))}
                  <div className="truncate" title={option.label}>
                    <HighlightMatches text={option.label} query={searchValue} />
                  </div>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-white/60 select-none">
              {emptySearchText}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
