import Wrapper from "@/shared/ui/wrapper";
import Logo from "../header/components/logo";
import { TelegramIcon, DiscordIcon, FarcasterIcon, MastodonIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/css";
import { AppLink } from "@/shared/ui/app-link";
import {
  links,
  socialIconLinks,
} from "@/shared/lib/constants/links";

function FooterPanel({ className }: { className?: string }) {
  return (
    <footer
      className={cn("bg-zinc-950 text-white pt-4 md:pt-0 py-6 md:min-h-[200px] relative z-10", className)}
    >
      <Wrapper>
        <div className="flex flex-col md:flex-row md:gap-12 md:justify-between gap-4">
          <div className="max-w-5xl flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className=" text-white py-2 rounded-lg font-bold">
                <Logo />
              </div>
              <div className="flex gap-3">
                {socialIconLinks.map((link) => {
                  const IconComponent =
                    link.title === "Telegram"
                      ? TelegramIcon
                      : link.title === "Discord"
                        ? DiscordIcon
                        : link.title === "Farcaster"
                          ? FarcasterIcon
                          : link.title === "Mastodon"
                            ? MastodonIcon
                            : null;

                  if (!IconComponent) return null;

                  return (
                    <AppLink
                      key={link.title}
                      href={link.href}
                      variant="white"
                      aria-label={link.title}
                    >
                      <IconComponent width={20} height={20} />
                    </AppLink>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-zinc-600 leading-relaxed text-sm max-w-4xl">
                App is a reputation-aware, decentralized knowledge infrastructure for AI agents. It unlocks powerful, transparent analytics that help agents identify what truly matters and make better-informed decisions.
              </p>
            </div>

            <div className="text-zinc-600 text-sm">Copyright © 2025</div>
          </div>

          <div className="grid grid-cols-2 pt-8 gap-x-8 gap-y-6 md:hidden">
            {links.map((link) => (
              <AppLink
                key={link.title}
                href={link.href}
                variant="white"
                className="text-sm"
              >
                {link.title}
              </AppLink>
            ))}
          </div>

          <div className="hidden md:flex flex-col justify-center gap-6 flex-shrink-0 pr-4">
            <div className="flex gap-12 items-center">
              {links.slice(0, -1).map((link) => (
                <AppLink
                  key={link.title}
                  href={link.href}
                  variant="white"
                  className="text-sm"
                >
                  {link.title}
                </AppLink>
              ))}
            </div>

            <div className="flex justify-end">
              {links.slice(-1).map((link) => (
                <AppLink
                  key={link.title}
                  href={link.href}
                  variant="white"
                  className="text-sm"
                >
                  {link.title}
                </AppLink>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
}

export default FooterPanel;
