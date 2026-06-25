import { memo } from "react";
import UserProfile from "@/entities/user-profile";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { cn } from "@/shared/lib/utils/css";

interface YapperCheckHeaderProps {
  avatarUrl: string;
  username: string;
  isVerified?: boolean;
  twitterHandle: string;
  yapperId: string;
  className?: string;
}

export const YapperCheckHeader = memo(function YapperCheckHeader({ avatarUrl, username, isVerified, twitterHandle, yapperId, className }: YapperCheckHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 [@media(max-height:800px)]:pl-2 pl-3 [@media(max-height:800px)]:py-2 py-4", className)}>
      <div className="min-w-0 flex-1">
        <UserProfile
          avatarUrl={avatarUrl}
          username={username}
          isVerified={isVerified}
          twitter_handle={twitterHandle}
        />
      </div>
      <Link href={`/dopaminer/${yapperId}`} className="flex-shrink-0 pr-2">
        <Button className="w-[84px]" variant="frame-hover-glow" frameHeight={24}>
          Profile
        </Button>
      </Link>
    </div>
  );
});
