import { AppImage } from "@/shared/ui/app-image";
import { ExternalLink, NewIcon, VerifiedIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";
import React from "react";

function UserProfile({
  avatarUrl,
  username,
  isVerified,
  twitter_handle,
  isNew,
  userNameTitle,
}: {
  avatarUrl: string;
  username: React.ReactNode;
  userNameTitle?: string;
  isVerified?: boolean;
  isNew?: boolean;
  twitter_handle?: string;
  usernameClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2 w-full min-w-0">
      <div className="relative shrink-0">
        <AppImage src={avatarUrl} alt={typeof username === "string" ? username : ""} className="w-6 h-6 mask-octagon-rotated" width={24} height={24} fallbackVariant="octagonRotated" />
        {isVerified && (
          <VerifiedIcon className="absolute -right-1 -top-0.5 size-3 text-white drop-shadow-md" />
        )}
        {isNew && (
          <NewIcon className="absolute -bottom-0.5 w-4 h-2 right-1/2 translate-x-1/2" />
        )}
      </div>
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <h3
          className={cn("text-sm font-normal truncate")}
          title={typeof username === "string" ? username : userNameTitle}
        >
          {username}
        </h3>
        {twitter_handle && (
          <a
            href="#"
            className="group flex items-center gap-1 bg-zinc-800 h-5 px-2 py-1 text-xs leading-none text-white font-semibold group-hover:bg-zinc-50 hover:bg-zinc-50 group-hover:text-black hover:text-black transition-all flex-shrink-0"
          >
            @{twitter_handle}
            <ExternalLink className="text-white group-hover:text-black transition-all" />
          </a>
        )}
      </div>
    </div>
  );
}

export default React.memo(UserProfile);
