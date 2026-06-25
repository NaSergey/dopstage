"use client";

import { boosterItems1, boosterItems2 } from "../forms/constants";

interface BoostersPreviewProps {
  boosters: {
    newAuthor: boolean;
    consistency: boolean;
    frequency: boolean;
  };
  filters: {
    sentiment: boolean;
    soloMention: boolean;
    onlyMedia: boolean;
    verified: boolean;
  };
}

const BoosterItem = ({ label, enabled, Icon }: { label: string; enabled: boolean; Icon: React.FC }) => (
  <div className={`flex items-center gap-2 text-sm ${enabled ? "text-lime-500" : "text-zinc-400"}`}>
    <div className="w-6 h-6 flex items-center justify-center">
      <span><Icon /></span>
    </div>
    <span>{label}</span>
  </div>
);

export function BoostersPreview({ boosters, filters }: BoostersPreviewProps) {
  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <h3 className="text-sm text-zinc-500">Boosters</h3>
        <div className="space-y-2">
          {boosterItems1.map(item => (
            <BoosterItem 
              key={item.id}
              label={item.title}
              enabled={boosters?.[item.id as keyof typeof boosters]}
              Icon={item.Icon}
            />
          ))}
        </div>
      </div>

      <div className="flex-[2] space-y-4">
        <h3 className="text-sm text-zinc-500">Ai filter</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {boosterItems2.map(item => (
            <BoosterItem 
              key={item.id}
              label={item.title}
              enabled={filters?.[item.id as keyof typeof filters]}
              Icon={item.Icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
