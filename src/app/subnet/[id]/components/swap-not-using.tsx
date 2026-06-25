"use client";

import { Button } from "@/shared/ui/button";
import AppSelect from "@/shared/ui/app-select";
import MockIcon from "@/shared/assets/mock-icon.svg";
import mockIcon from "@/shared/assets/mock-icon.svg";
import NextImage from "next/image";
import {
  DopIcon,
  ShevronIcon as ChevronIcon,
  SwapIcon,
} from "@/shared/ui/icons";
import { Skeleton } from "@/shared/ui/skeleton";
import { useEffect, useState } from "react";
import NumericInput from "@/shared/ui/numeric-input";

const options = [
  { value: "KTA", label: "KTA", icon: MockIcon },
  { value: "GOO", label: "GOO", icon: MockIcon },
  {
    value: "TRANSET",
    label: "TRANSET",
    icon: MockIcon,
  },
  {
    value: "Pterodi",
    label: "Pterodi",
    icon: MockIcon,
  },
];

function Swap() {
  const [isFetching, setIsFetching] = useState(true);
  const [sellingAmount, setSellingAmount] = useState(0);
  const [buyingAmount, setBuyingAmount] = useState(0);

  const sellingAmountInDollars = sellingAmount * 100;
  const buyingAmountInDollars = buyingAmount * 100;

  useEffect(() => {
    setTimeout(() => {
      setIsFetching(false);
    }, 2000);
  }, []);

  return (
    <div className="[@media(max-height:880px)]:flex [@media(max-height:880px)]:items-center [@media(max-height:880px)]:pt-2 [@media(max-height:880px)]:pb-2 pt-4 px-4 pb-6.5 bg-zinc-900 border-r border-zinc-950 flex w-full">
      <div className="w-full">
        <div className="w-full [@media(max-height:880px)]:mb-4 mb-6">
          <div>
            <div className="flex items-center justify-between">
              <h5 className="text-xs leading-normal font-medium text-zinc-white">
                Selling
              </h5>
              <span className="text-xs leading-normal font-medium text-zinc-500">
                ${sellingAmountInDollars}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-0.5 my-2">
              {isFetching ? (
                <>
                  <Skeleton className="w-full h-10 rounded-2xl" />
                  <Skeleton className="w-full h-10 rounded-2xl" />
                </>
              ) : (
                <>
                  <AppSelect
                    options={options}
                    placeholder="Select"
                    className="w-full"
                  />
                  <NumericInput
                    value={sellingAmount}
                    onChange={(e) => setSellingAmount(Number(e.target.value))}
                    placeholder="0"
                  />
                </>
              )}
            </div>
          </div>

          <div className="h-6 relative flex justify-center items-center [@media(max-height:880px)]:my-2 my-6">
            <button className="relative z-5 size-6 flex flex-col items-center gap-0.5 justify-center bg-[#111114] cursor-pointer">
              <ChevronIcon variants="down" className="text-zinc-600 h-2 w-2" />

              <ChevronIcon variants="up" className="text-zinc-600 h-2 w-2 " />
            </button>
            <div className="w-full h-[1px] bg-black absolute top-1/2 left-0 -translate-y-1/2" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h5 className="text-xs leading-normal font-medium text-zinc-white">
                Buying
              </h5>
              <span className="text-xs leading-normal font-medium text-zinc-500">
                ${buyingAmountInDollars}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-0.5 my-2">
              {isFetching ? (
                <>
                  <Skeleton className="w-full h-10 rounded-2xl" />
                  <Skeleton className="w-full h-10 rounded-2xl" />
                </>
              ) : (
                <>
                  <AppSelect
                    options={options}
                    placeholder="Select"
                    className="w-full"
                  />
                  <NumericInput
                    value={buyingAmount}
                    onChange={(e) => setBuyingAmount(Number(e.target.value))}
                    placeholder="0"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {isFetching ? (
          <Skeleton className="w-full h-10 rounded-2xl" />
        ) : (
          <Button
            variant="frame-hover-fire"
            className="[@media(max-height:880px)]:h-7.5 w-full"
          >
            Connect wallet
          </Button>
        )}

        <div className="[@media(max-height:880px)]:mt-2 mt-4">
          {isFetching ? (
            <Skeleton className="w-full h-4 rounded-none" />
          ) : (
            <div className="flex flex-col items-center [@media(max-height:880px)]:gap-1 gap-2 text-xs leading-none text-zinc-400 ">
              <div className="flex items-center justify-center gap-2 ">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  Rate $1 = 0.089 KTA <SwapIcon />
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap justify-end ">
                  2% Fee
                  <NextImage
                    src={mockIcon}
                    className="rounded-full inline size-4"
                    alt="fee"
                  />
                </span>
              </div>
              <span className="flex items-center gap-1 whitespace-nowrap">
                Your reward 0 <DopIcon className="inline size-4" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Swap;
