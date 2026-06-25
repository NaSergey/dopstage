import { AppImage } from "@/shared/ui/app-image";
import { cn } from "@/shared/lib/utils/css";

export type LabelsOverlayItem = {
  id: string;
  top: number;
  name: string;
  subtitle?: string;
  imageSrc: string;
  showIcon?: boolean;
  color: string;
};

type LabelsOverlayProps = {
  items: LabelsOverlayItem[];
  hoveredId: string | null;
  selectedId: string | null;
};

const ICON_SIZE = 16; // px

const LABEL_CLIP_COLLAPSED =
  "polygon(0% 50%, 30% 8%, 90% 8%, 100% 20%, 100% 80%, 90% 92%, 30% 92%)";
const LABEL_CLIP_EXPANDED =
  "polygon(0% 14%, 4% 0%, 96% 0%, 100% 14%, 100% 86%, 96% 100%, 4% 100%, 0% 86%)";

export function LabelsOverlay({ items, hoveredId, selectedId }: LabelsOverlayProps) {
  const hasFocus = Boolean(hoveredId || selectedId);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-visible z-[70]"
    >
      {items.map((it) => {
        const isHovered = hoveredId === it.id;
        const isSelected = selectedId === it.id;
        const isActive = isHovered || isSelected;
        const showExpanded = isHovered;

        const zClass = isHovered
          ? "z-[70]"
          : isSelected
            ? "z-[60]"
            : "z-[40]";

        const dimClass =
          hasFocus && !isActive ? "filter saturate-[0.6] brightness-[0.8]" : "";

        const badgePosSizeClass = showExpanded
          ? "left-[17px] w-[160px] h-[52px] shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
          : "left-[-24px] w-6 h-6";

        const badgeClip = showExpanded ? LABEL_CLIP_EXPANDED : LABEL_CLIP_COLLAPSED;

        return (
          <div
            key={it.id}
            className={cn("absolute right-0 h-0 w-0 ", zClass, dimClass)}
            style={{ top: it.top }}
          >
            {/* Pointer */}
            <div
              className={cn(
                "absolute left-0 top-0 -translate-y-1/2 w-[19px] h-[26px] z-20",
                showExpanded ? "block shadow-[0_12px_28px_rgba(0,0,0,0.45)]" : "hidden",
              )}
              style={{
                clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
                backgroundColor: it.color,
              }}
            />

            {/* Badge */}
            <div
              className={cn(
                "absolute top-0 -translate-y-1/2 z-10 overflow-hidden box-border transition-[width,height,left] duration-[140ms] ease-out",
                badgePosSizeClass,
              )}
              style={{ clipPath: badgeClip, backgroundColor: it.color }}
            >


              <div
                className={cn(
                  "relative z-[2] h-full w-full flex gap-1",
                  showExpanded
                    ? "pt-[10px] pr-[14px] pb-[8px] pl-[12px] justify-start items-start"
                    : "p-0 justify-center items-center",
                )}
              >
                {it.showIcon && (
                  <div
                    className={cn(
                      "w-6 h-6 flex items-center justify-center shrink-0",
                      showExpanded ? "self-start" : "self-center mt-0",
                    )}
                  >
                    <AppImage
                      src={it.imageSrc}
                      alt=""
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                      className="block object-cover"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "min-w-0 flex-col justify-center gap-[2px]",
                    showExpanded ? "flex" : "hidden",
                  )}
                >
                  <div
                    className="text-xs font-semibold text-black/90 truncate max-w-[160px]"
                    title={it.name}
                  >
                    {it.name}
                  </div>
                  {it.subtitle ? (
                    <div className="text-xs font-medium text-black/90 truncate max-w-[160px]">
                      {it.subtitle}
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  "absolute inset-0 pointer-events-none box-border z-[3] origin-center",
                  showExpanded
                    ? "border border-black/10"
                    : isActive
                      ? "border-[2px] border-[rgba(255,255,255,0.65)] scale-[0.98]"
                      : "border border-[rgba(255,255,255,0.10)] scale-[0.985]",
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

