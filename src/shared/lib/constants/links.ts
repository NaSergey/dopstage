/**
 * Common links used across the application
 */

export interface LinkItem {
  title: string;
  href: string;
}

export interface IconLinkItem {
  alt: string;
  iconSrc: string;
  href: string;
}

// Internal navigation links
export const links: LinkItem[] = [
  { title: "About", href: "/" },
  { title: "Community", href: "/" },
  { title: "Privacy Policy", href: "/" },
  { title: "FAQ", href: "/faq" },
];

// External resource links (disabled — inert hrefs)
export const resLinks: LinkItem[] = [
  { title: "Research", href: "#" },
  { title: "Docs", href: "#" },
];

// Social media links (disabled — inert hrefs)
export const socialLinks: LinkItem[] = [
  { title: "X", href: "#" },
  { title: "Discord", href: "#" },
  { title: "Telegram", href: "#" },
];

// Icon-based links (disabled — inert hrefs)
export const iconLinks: IconLinkItem[] = [
  {
    alt: "Virtuals",
    iconSrc: "",
    href: "#",
  },
  {
    alt: "DexScreener",
    iconSrc: "",
    href: "#",
  },
];
// Social media icon links for header/footer (disabled — inert hrefs)
export const socialIconLinks: LinkItem[] = [
  { title: "Telegram", href: "#" },
  { title: "Mastodon", href: "#" },
  { title: "Farcaster", href: "#" },
  { title: "Discord", href: "#" },
];

