"use client";

interface StatsCardProps {
  label: string;
  value: React.ReactNode;
}

const StatsCard = ({ label, value }: StatsCardProps) => (
  <div className="bg-zinc-900 py-4 px-2">
    <div className="text-sm text-zinc-400 mb-2">{label}</div>
    <div className="text-base text-zinc-50">{value}</div>
  </div>
);

interface StatsPreviewProps {
  rewardAllocation: number;
  devSupplyAllocation: number;
  campaignDays: number;
}

export function StatsPreview({ rewardAllocation, devSupplyAllocation, campaignDays }: StatsPreviewProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatsCard label="Allocation" value={`${rewardAllocation ?? 0}% of the pool`} />
      <StatsCard label="Dev supply" value={<span className="text-zinc-500">{devSupplyAllocation ?? 0}%</span>} />
      <StatsCard label="Campaign duration" value={`${campaignDays ?? 0}d`} />
    </div>
  );
}
