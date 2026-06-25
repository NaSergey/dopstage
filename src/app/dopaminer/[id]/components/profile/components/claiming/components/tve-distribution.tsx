// "use client";

// import { ApiComponents } from "@/shared/api/schema";
// import { formatK } from "@/shared/lib/format/formatK";
// import { cn } from "@/shared/lib/utils/css";
// import AppTooltip from "@/shared/ui/app-tooltip";
// import ChevronIcon from "@/shared/ui/icons/ui-controls/shevron-icon";
// import { InfoIcon } from "lucide-react";
// import Image from "next/image";
// import { useState, useRef, useEffect } from "react";
// import { Skeleton } from "@/shared/ui/skeleton";
// import { EmptyText } from "@/shared/ui/empty-text";

// interface ITveDistributionProps {
//   data?: ApiComponents["YapperPageRewardsDistributionResponse"];
//   isLoading?: boolean;
//   hasError?: boolean;
// }

// function TveDistribution({ data, isLoading, hasError }: ITveDistributionProps) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     if (open) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [open]);

//   return (
//     <div ref={ref} className="relative w-full">
//       {/* Trigger */}
//       <div
//         onClick={() => {
//           if (isLoading || hasError) return;
//           setOpen((p) => !p);
//         }}
//         className="group flex items-center justify-between gap-1 py-3 w-full cursor-pointer"
//       >
//         <div className="flex items-center gap-1 grow">
//           <h4 className="flex items-center grow gap-2 text-sm leading-sm text-white/30">
//             TVE
//             <span className="text-white">
//               {isLoading ? (
//                 <Skeleton className="w-10 h-3 rounded-sm" />
//               ) : (
//                 <EmptyText
//                   value={data?.tve}
//                   formatter={formatK}
//                   className="text-white"
//                 />
//               )}
//             </span>
//           </h4>

//           <div
//             className={cn(
//               "flex justify-center items-center size-4 transition-all",
//               open && "bg-[#6314FF] text-black",
//             )}
//           >
//             <ChevronIcon
//               variants={open ? "down" : "up"}
//               className={cn(
//                 "size-4 transition-all h-2.5 w-4 pb-0.5 group-hover:text-white/60",
//               )}
//             />
//           </div>
//         </div>

//         <AppTooltip content={<p>Note</p>}>
//           <InfoIcon className="size-4 text-zinc-600" />
//         </AppTooltip>
//       </div>

//       {/* Dropdown */}
//       {open && !isLoading && !hasError && (
//         <div
//           className="
//             absolute -left-4 top-full -right-4 w-[calc(100%+32px)] py-4.5 px-3
//             bg-zinc-800 shadow-xl z-50
//           "
//         >
//           <div className="flex flex-col w-full gap-2.5 group">
//             {(data?.tve_distribution ?? []).map((item, idx, arr) => (
//                 <div
//                   key={item.token_symbol}
//                   className="flex items-start gap-3"
//                 >
//                   <Image
//                     src={item.token_logo_url}
//                     alt={item.token_symbol}
//                     width={16}
//                     height={16}
//                     className="mask-octagon"
//                   />

//                   <div
//                     className={cn(
//                       "w-full",
//                       idx !== arr.length - 1 && "border-b pb-2.5 border-zinc-700",
//                     )}
//                   >
//                     <div className="flex gap-1 text-white text-xs mb-2 leading-none">
//                       <span className="text-white">
//                         {formatK(item.tve_in_tokens ?? 0)}
//                       </span>
//                       {item.token_symbol.toUpperCase()}
//                     </div>

//                     <div className="flex gap-1 text-zinc-500 text-xs leading-none">
//                       ${formatK(item.tve_in_usd ?? 0)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TveDistribution;
