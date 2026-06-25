"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import {
  ShareIcon,
  VerifiedIcon,
  CarouselArrowIcon,
  CheckIcon,
  DopIcon,
} from "@/shared/ui/icons";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/shared/ui/dialog";
import Logo from "@/widgets/header/components/logo";
import { formatK } from "@/shared/lib/format/formatK";
import { cn } from "@/shared/lib/utils/css";
import Image from "next/image";
import Achievements from "./achievements/achievements";
import SpiderChart from "./spider-chart/spider-chart";
import Contribution from "./contribution/contribution";
import { toBlob } from "html-to-image";
import { toast } from "sonner";
import { X } from "lucide-react";

interface HeaderData {
  logo_url?: string | null;
  display_name?: string | null;
  leaderboard_position?: number | null;
  yap_score_30d?: number | null;
  twitter_handle?: string | null;
  avg_yap_price?: number | null;
  is_authenticated?: boolean | null;
  total_dops?: number | null;
  dop_score?: number | null;
}

interface ShareButtonProps {
  headerData?: HeaderData | null;
  isHeaderLoading: boolean;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;

function ShareButton({ headerData, isHeaderLoading }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { id } = useParams<{ id: string }>();
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const handleShareClick = () => {
    if (isPreparing || open) return;
    setIsPreparing(true);

    const srcs = ["/bgCard.png", headerData?.logo_url].filter(Boolean) as string[];
    const promises = srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    );

    Promise.all(promises).then(() => {
      requestAnimationFrame(() => {
        setIsPreparing(false);
        setOpen(true);
      });
    });
  };

  const handleCopyImage = async () => {
    if (!dialogContentRef.current) return;

    setIsGenerating(true);
    try {
      const blob = await toBlob(dialogContentRef.current, {
        backgroundColor: "#09090b", // zinc-950
        pixelRatio: 1,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        style: {
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          maxWidth: "none",
          maxHeight: "none",
          margin: "0",
          transform: "none",
          transformOrigin: "top left",
        },
        filter: (node) => {
          // Exclude button from image generation
          return !(
            node instanceof HTMLElement &&
            node.classList.contains("exclude-from-image")
          );
        },
      });

      if (!blob) {
        toast.error("Failed to generate image");
        setIsGenerating(false);
        return;
      }

      // Check if Clipboard API with image support is available
      if (
        navigator.clipboard &&
        navigator.clipboard.write &&
        window.ClipboardItem
      ) {
        // Copy image to clipboard
        const clipboardItem = new ClipboardItem({
          "image/png": blob,
        });
        await navigator.clipboard.write([clipboardItem]);
        setIsCopied(true);
        setIsGenerating(false);
        // Reset copied state after 3 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 4000);
      } else {
        toast.error("Clipboard API not supported in this browser");
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleShareClick}
        disabled={isPreparing}
        className="text-white w-[112px]"
        variant="frame-hover-glow"
        frameHeight={24}
      >
        <span className="flex items-center -mb-0.5 text-xs font-medium gap-1">
          {isPreparing ? "Loading..." : "Profile Share"}
          {!isPreparing && <ShareIcon className="size-3" />}
        </span>
      </Button>
      <DialogContent
        hideTitle
        className="w-[1200px] z-[999] h-[600px] max-w-none !p-0 !gap-0 overflow-visible font-mono [&>button]:hidden !bg-transparent !grid-rows-none !max-h-none"
      >
        <div
          ref={dialogContentRef}
          className="h-[600px] w-full flex flex-col bg-zinc-950 relative"
          style={{
            backgroundImage: "url(/bgCard.png)",
            backgroundSize: "1200px 600px",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Close button - absolute positioned on the right, outside content */}
          <DialogClose className="absolute top-0 cursor-pointer right-[-32px] z-10 rounded-md opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
            <X className="h-5 w-5 text-white" />
          </DialogClose>
          {/* Top header section */}
          <div className="flex flex-col px-5 py-4 border-b border-zinc-800">
            {/* First block - Logo, Avatar, Metrics */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <Logo />
                {/* Avatar */}
                <div className="w-[108px] h-[108px] ml-0.5 -mt-0.5 flex items-center justify-center flex-shrink-0">
                  {isHeaderLoading ? (
                    <div className="w-full h-full bg-zinc-800 animate-pulse" />
                  ) : (
                    <Image
                      src={headerData?.logo_url ?? ""}
                      alt={headerData?.display_name ?? ""}
                      width={108}
                      height={108}
                      className="w-full h-full shrink-0 mask-octagon-rotated"
                    />
                  )}
                </div>
              </div>

              {/* Right section - Metrics */}
              <div className="flex gap-26 pt-1 mr-2">
                <div>
                  <div className="text-sm text-white bg-black px-0.5 py-0.5 w-fit">
                    Leaderboard
                  </div>
                  {isHeaderLoading ? (
                    <div className="text-8xl font-extrabold text-white">
                      #---
                    </div>
                  ) : (
                    <div className="text-8xl font-extrabold text-white">
                      #{headerData?.leaderboard_position ?? 0}
                    </div>
                  )}
                </div>
                <div className="-mr-0.5">
                  <div className="text-sm text-white bg-black px-0.5 py-0.5 w-fit">
                    DScore
                  </div>
                  {isHeaderLoading ? (
                    <div className="text-8xl font-extrabold text-white">
                      ---
                    </div>
                  ) : (
                    <div className="text-8xl font-extrabold text-white">
                      {formatK(headerData?.dop_score ?? 0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-white bg-black px-0.5 py-0.5 w-fit">
                    Dops Earned
                  </div>
                  {isHeaderLoading ? (
                    <div className="text-8xl font-extrabold text-white">
                      ---
                    </div>
                  ) : (
                    <div className="text-8xl font-extrabold text-white">
                      {formatK(headerData?.total_dops ?? 0)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Second block - Profile info and financial metrics */}
            <div className="flex items-start justify-between mt-4">
              {/* Profile info */}
              <div className="flex flex-col gap-1.5 ">
                {/* Username with verified */}
                <div className="flex items-center gap-2">
                  {isHeaderLoading ? (
                    <div className="text-2xl bg-black px-2 font-bold text-white flex items-center gap-2">
                      ---
                    </div>
                  ) : (
                    <div className="text-2xl bg-black px-2 font-bold text-white flex items-center gap-2">
                      {headerData?.display_name ?? ""}
                      {headerData?.is_authenticated && (
                        <VerifiedIcon className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
                {/* Handle */}
                {isHeaderLoading ? (
                  <div className="text-sm px-2 bg-black text-zinc-400 w-fit">
                    @---
                  </div>
                ) : (
                  <div className="text-sm px-2 bg-black text-zinc-400 w-fit">
                    @{headerData?.twitter_handle ?? ""}
                  </div>
                )}
              </div>

              {/* Financial metrics - to the right of profile info */}
              <div className="flex flex-col gap-2 pr-1 pt-2">
                {/* {isRewardsLoading ? (
                  <div className="text-sm px-2 bg-black text-white w-fit whitespace-nowrap">
                    Total tweets — $---
                  </div>
                ) : (
                  <div className="text-sm px-2 bg-black text-white w-fit whitespace-nowrap">
                    Total tweets — ${formatK(rewardsData?.tve ?? 0)}
                  </div>
                )} */}
                {isHeaderLoading ? (
                  <div className="text-sm px-2 bg-black text-white w-fit whitespace-nowrap">
                    Tweet Price - $---
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm px-2 bg-black text-white w-fit whitespace-nowrap">
                    <span>Tweet Price - {formatK(headerData?.avg_yap_price ?? 0)}</span>
                    <DopIcon className="size-3.5 shrink-0 ml-1" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col gap-18 pt-4 px-6 overflow-hidden">
            {/* Bottom section - 3 large blocks */}
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}
            >
              {/* Achievements block */}
              <div className="rounded-lg py-4">
                {id && (
                  <Achievements
                    id={id}
                    iconSize="large"
                    titleClassName="bg-black text-sm px-1 py-0.5 mb-6 w-fit"
                  />
                )}
              </div>

              {/* Contributions block */}
              <div className="p-4">
                <div>
                  {id && (
                    <Contribution
                      id={id}
                      titleClassName="bg-black text-sm px-1 py-0.5 mb-6 w-fit"
                    />
                  )}
                </div>
              </div>

              {/* Radar chart block */}
              <div className="py-4">
                <div className="h-full w-full flex items-center justify-end">
                  {id && <SpiderChart id={id} />}
                </div>
              </div>
            </div>
          </div>

          {/* dopaminer.com text - absolute positioned */}
          <div className="absolute bottom-0 right-0 bg-black px-1 py-0.5 font-light text-white text-sm">
            dopaminer.com
          </div>
        </div>

        {/* Copy Image Button - positioned below card, centered */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleCopyImage}
            disabled={isGenerating}
            variant="frame-hover-glow"
            className="text-white w-[205px] exclude-from-image flex items-center gap-2"
          >
            {isGenerating ? (
              "Copying..."
            ) : isCopied ? (
              <>
                ID Card copied
                <CheckIcon className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Copy ID card"
            )}
            {!isCopied && (
              <CarouselArrowIcon
                className={cn(
                  "transition-transform duration-200 ml-2 rotate-90",
                )}
              />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareButton;
