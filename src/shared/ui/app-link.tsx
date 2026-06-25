"use client";

import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/shared/lib/utils/css";

type AppLinkVariant = "white" | "zinc";

type AppLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  variant?: AppLinkVariant;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

/**
 * Universal link component that handles both internal and external links
 * - Internal links (starting with /) use Next.js Link for client-side navigation
 * - External links use regular <a> tag with target="_blank" and rel="noopener noreferrer"
 * 
 * Variants:
 * - "white": white text with hover:opacity-70
 * - "zinc": text-zinc-600 with hover:text-white
 * 
 * @example
 * <AppLink href="/about" variant="white">About</AppLink>
 * <AppLink href="/team" variant="zinc">Team</AppLink>
 * <AppLink href="https://example.com">External</AppLink>
 * <AppLink href="/icon-link"><Icon /></AppLink>
 */
export function AppLink({
  href,
  children,
  className,
  external,
  variant = "white",
  ...props
}: AppLinkProps) {
  const isExternal = external || (href.startsWith("http") || href.startsWith("//"));

  const variantClasses = {
    white: "text-white transition-opacity hover:opacity-70",
    zinc: "text-zinc-600 transition-colors hover:text-white",
  };

  const baseClassName = cn(variantClasses[variant], className);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClassName} {...props}>
      {children}
    </Link>
  );
}

