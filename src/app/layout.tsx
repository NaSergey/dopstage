import type { Metadata, Viewport } from "next";
import { Providers } from "./(internal)/providers";
import { chivoMono, chivo } from "@/shared/config/fonts";
import { MobileGuard } from "@/widgets/mobile/mobile-guard";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "App",
  description: "App",
  icons: {
    icon: [
      { url: "/icon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon/favicon.svg", type: "image/svg+xml" },
      { url: "/icon/favicon.ico" },
    ],
    apple: [
      { url: "/icon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/icon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${chivoMono.variable} ${chivo.variable} antialiased h-full bg-zinc-950 dark font-sans`}
      >
        <MobileGuard />
        <div className="app-content h-full">
          <NextTopLoader color="#6314FF" showSpinner={false} />
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
