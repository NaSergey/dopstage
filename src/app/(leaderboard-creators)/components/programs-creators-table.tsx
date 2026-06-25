"use client";

import { AppImage } from "@/shared/ui/app-image";
import { DataTable } from "@/shared/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/shared/lib/format/formatNumber";
import { formatK } from "@/shared/lib/format/formatK";
import { formatAddress } from "@/shared/lib/format/formatAddress";
import Sparkline from "@/shared/ui/sparkline/sparkline";
import { DopIcon, InfoIcon, RankArrowIcon } from "@/shared/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useMemo, useState } from "react";
import Sort from "@/shared/ui/sort";
import { PaginationControls } from "@/shared/ui/pagination";

type ProgramsCreatorData = {
  id: number;
  name: string;
  imageUrl: string;
  isNew: boolean;
  yapPrice: number;
  avgDropsPerTweet: number;
  fdv: number;
  tvd: number;
  totalTweets: number;
  allocation: number;
  engagement: number;
  programsCount: number;
  avgTweetYS: number;
  avgRewardPerUser: number;
  yapPriceChart: number[];
  programsLogos: string[];
};

interface ProgramsCreatorsTableProps {
  pageSize?: number;
  className?: string;
}

export function ProgramsCreatorsTable({
  pageSize = 10,
  className = "",
}: ProgramsCreatorsTableProps) {
  const [page, setPage] = useState(1);

  const mockData = useMemo(() => generateMockProgramsCreatorsData(), []);

  const rows = useMemo(
    () => mockData.slice((page - 1) * pageSize, page * pageSize),
    [mockData, page, pageSize],
  );

  const totalPages = Math.ceil(mockData.length / pageSize);

  return (
    <div className={`px-4 pt-4 bg-zinc-900 ${className}`}>
      <DataTable
        columns={columns}
        data={rows}
        className="text-xs"
        rowClassName="hover:bg-[#6314FF66] cursor-pointer group border-b border-zinc-800"
        noDataContent={
          <EmptyState
            showIcon={true}
            title={"Something went wrong, please reload"}

          />
        }
      />
      <PaginationControls
        currentPage={page}
        isLastPage={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

function generateMockProgramsCreatorsData(): ProgramsCreatorData[] {
  return [
    {
      id: 1,
      name: "0x7198def0105f478961abc123def456789012345",
      imageUrl: "/profile-test.png",
      isNew: false,
      yapPrice: 11100.7,
      avgDropsPerTweet: 88000,
      fdv: 900000,
      tvd: 2925,
      totalTweets: 88000,
      allocation: 88,
      engagement: 10.7,
      programsCount: 342,
      avgTweetYS: 88.0,
      avgRewardPerUser: 2925,
      yapPriceChart: [10500, 10800, 11000, 11100, 11100.7],
      programsLogos: [
        "/profile-test.png",
        "/profile-test.png",
        "/profile-test.png",
      ],
    },
    {
      id: 2,
      name: "0xa1b2c3d4e5123456789fedcba9876543210abcd",
      imageUrl: "/profile-test.png",
      isNew: false,
      yapPrice: 9500.5,
      avgDropsPerTweet: 75000,
      fdv: 850000,
      tvd: 2500,
      totalTweets: 75000,
      allocation: 75,
      engagement: 12.3,
      programsCount: 298,
      avgTweetYS: 75.5,
      avgRewardPerUser: 2500,
      yapPriceChart: [9000, 9200, 9400, 9500, 9500.5],
      programsLogos: ["/profile-test.png", "/profile-test.png"],
    },
    {
      id: 3,
      name: "0xf6g7h8i9j0987654321abcdefabcdef123456789",
      imageUrl: "/profile-test.png",
      isNew: true,
      yapPrice: 8500.25,
      avgDropsPerTweet: 65000,
      fdv: 750000,
      tvd: 2100,
      totalTweets: 65000,
      allocation: 65,
      engagement: 8.9,
      programsCount: 156,
      avgTweetYS: 65.25,
      avgRewardPerUser: 2100,
      yapPriceChart: [8000, 8200, 8300, 8500, 8500.25],
      programsLogos: [
        "/profile-test.png",
        "/profile-test.png",
        "/profile-test.png",
        "/profile-test.png",
      ],
    },
  ];
}

const columns: ColumnDef<ProgramsCreatorData>[] = [
  {
    accessorKey: "#",
    header: () => (
      <div className="flex items-center gap-1 text-zinc-500">
        <Sort value={null} className="text-zinc-500">
          <span>#</span>
        </Sort>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center leading-none">
            <span className="text-white font-medium">{row.original.id}</span>
            <span className="inline-flex text-zinc-500 mt-1.5">
              <RankArrowIcon className="w-3 h-1" />
              <span className="text-[#55FF00] text-[6px] font-bold">1</span>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-1 text-zinc-500">
        <Sort value={null} className="text-zinc-500">
          <span>@</span>
        </Sort>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-medium font-mono tabular-nums tracking-tight">
            {formatAddress(row.original.name)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "yapPrice",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>Dop price</span>
      </Sort>
    ),
    cell: ({ row }) => {
      const { yapPriceChart } = row.original;
      return (
        <div className="flex items-center gap-8">
          <div className="text-white">
            ${formatNumber(row.original.yapPrice)}
          </div>
          <div className="w-16 h-6">
            <Sparkline data={yapPriceChart} width={64} height={24} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "avgDropsPerTweet",
    header: () => (
      <div className="flex items-center gap-1 text-zinc-500">
        <span>Avg Drops p/tweet</span>
        <DopIcon />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">
          {formatK(row.original.avgDropsPerTweet)}
        </div>
      );
    },
  },
  {
    accessorKey: "fdv",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>FDV</span>
      </Sort>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">${formatNumber(row.original.fdv)}</div>
      );
    },
  },
  {
    accessorKey: "tvd",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>TVD</span>
      </Sort>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">${formatNumber(row.original.tvd)}</div>
      );
    },
  },
  {
    accessorKey: "totalTweets",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>Total Tweets</span>
      </Sort>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">{formatK(row.original.totalTweets)}</div>
      );
    },
  },
  {
    accessorKey: "allocation",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>Allocation</span>
      </Sort>
    ),
    cell: ({ row }) => {
      return <div className="text-white">{row.original.allocation}%</div>;
    },
  },
  {
    accessorKey: "engagement",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>Engagement rate</span>
      </Sort>
    ),
    cell: ({ row }) => {
      return <div className="text-white">{row.original.engagement}%</div>;
    },
  },
  {
    accessorKey: "programs",
    header: () => (
      <div className="flex items-center gap-1 text-zinc-500">
        <span>Programs</span>
        <InfoIcon />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {row.original.programsLogos.map((logo, index) => (
              <AppImage
                key={index}
                src={logo}
                alt={`Program ${index + 1}`}
                width={24}
                height={24}
                className="w-6 h-6 mask-octagon"
                fallbackVariant="octagon"
                style={{
                  marginLeft: index > 0 ? "-8px" : "0",
                  zIndex: 10 - index,
                }}
              />
            ))}
          </div>
          <span className="text-white text-xs">
            +{formatK(row.original.programsCount)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "avgTweetYS",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>Avg tweet DS</span>
      </Sort>
    ),
    cell: ({ row }) => {
      return <div className="text-white">{row.original.avgTweetYS}</div>;
    },
  },
  {
    accessorKey: "avgRewardPerUser",
    header: () => (
      <Sort value={null} className="text-zinc-500">
        <span>Avg reward p/user</span>
      </Sort>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-white">
          ${formatNumber(row.original.avgRewardPerUser)}
        </div>
      );
    },
  },
];
