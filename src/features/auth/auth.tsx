"use client";

import { AppImage } from "@/shared/ui/app-image";
import { Button } from "@/shared/ui/button";
import { DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { FrameSurface } from "@/shared/ui/frame-surface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import copyToClipboard from "@/shared/lib/utils/copy-to-clipboard";
import { useRouter } from "next/navigation";
import { truncateAddress } from "@/shared/lib/utils/utils";
import { CopyIcon, LogoutIcon, XIcon } from "@/shared/ui/icons";
import { useAuthStore } from "./auth-store";

function Auth() {
  const { user, wallet, logInX, logOutX, connectWallet, disconnectWallet } =
    useAuthStore();
  const navigate = useRouter().push;

  const auth = () => {
    logInX({ name: "John Doe", avatar: "" });
  };

  const connectUserWallet = () => {
    connectWallet("0x1234567890123456789012345678901234567890");
  };

  const goToProfile = () => {
    navigate("/dopaminer/123");
  };

  const copyWalletAddress = () => {
    copyToClipboard(wallet.address);
  };

  const connectAnotherWallet = () => {
  };

  return user.isAuthenticated ? (
    <div className="w-[320px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none cursor-pointer">
          <FrameSurface
            height={36}
            inset={14}
            className="relative flex items-center gap-2"
            contentElement={null}
            renderUnderlay={(context) => (
              <div
                className="absolute inset-0 bg-zinc-900"
                style={context.clipPathStyle}
                aria-hidden="true"
              />
            )}
          >
            <div className="relative z-20 flex items-center gap-2 w-full h-full">
              <div className="w-full h-full flex items-center gap-2 pl-8">
                <AppImage
                  src="/profile-test.png"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="mask-octagon-rotated"
                />
                <span
                  className="text-sm font-medium text-white truncate max-w-[100px]"
                  title={user.name}
                >
                  {user.name}
                </span>
              </div>
              <div className="relative z-10">
                {wallet.isConnected ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#55FF00] rounded-full animate-pulse" />
                    <div className="text-sm font-medium text-zinc-600 pr-8">
                      {truncateAddress(wallet.address)}
                    </div>
                  </div>
                ) : (
                  <Button
                    frameHeight={36}
                    variant="frame-hover-fire"
                    className="w-[170px]"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={connectUserWallet}
                  >
                    Connect wallet
                  </Button>
                )}
              </div>
            </div>
          </FrameSurface>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[320px] z-50 py-2 px-3 bg-zinc-800 flex justify-center mt-2 left-0"
          align="start"
        >
          <DropdownMenuGroup className="w-full">
            <DropdownMenuItem
              onSelect={goToProfile}
              className="text-xs leading-normal text-white cursor-pointer hover:opacity-80 transition-all py-2.5 outline-none"
            >
              Go to profile
            </DropdownMenuItem>

            <DropdownMenuSeparator className="h-[1px] bg-zinc-700 my-1" />

            {wallet.isConnected && (
              <>
                <DropdownMenuItem
                  onSelect={copyWalletAddress}
                  className="flex items-center justify-between text-xs leading-normal text-white cursor-pointer hover:opacity-80 transition-all py-2.5 outline-none"
                >
                  Copy wallet address
                  <CopyIcon className="w-3 h-3 text-zinc-500" />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="h-[1px] bg-zinc-700 my-1" />
              </>
            )}

            {wallet.isConnected && (
              <>
                <DropdownMenuItem
                  onSelect={connectAnotherWallet}
                  className="text-xs leading-normal text-white cursor-pointer hover:opacity-80 transition-all py-2.5 outline-none"
                >
                  Connect another wallet
                </DropdownMenuItem>
                <DropdownMenuSeparator className="h-[1px] bg-zinc-700 my-1" />
              </>
            )}

            {wallet.isConnected && (
              <>
                <DropdownMenuItem
                  onSelect={disconnectWallet}
                  className="flex items-center justify-between text-xs leading-normal text-white cursor-pointer hover:opacity-80 transition-all py-2.5 outline-none"
                >
                  Disconnect wallet
                  <LogoutIcon className="w-3 h-3 text-zinc-500" />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="h-[1px] bg-zinc-700 my-1" />
              </>
            )}

            <DropdownMenuItem
              onSelect={logOutX}
              className="flex items-center justify-between text-xs leading-normal text-white cursor-pointer hover:opacity-80 transition-all py-2.5 outline-none"
            >
              Log out
              <XIcon className="w-3 h-3 text-zinc-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Button frameHeight={36} variant="frame-hover-fire" className="w-[120px] overflow-hidden" onClick={auth}>
      Sign In
    </Button>
  );
}

export default Auth;
