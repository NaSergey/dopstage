"use client";

import { useEffect, useState } from "react";
import Logo from "../header/components/logo";
import { SnakeGame } from "../snake-games/snake-game";
import FooterPanel from "../footer/footer-panel";

export function MobileGuard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsMobile(window.innerWidth < 768), 100);
    };
    check();
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("resize", check); clearTimeout(timer); };
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col overflow-y-auto">
      <div className="flex flex-col px-4 pt-4 h-[90dvh] flex-shrink-0">
        <Logo />
        <p className="text-zinc-50 text-lg pt-10 px-8 text-center">
          We are currently desktop-only.
          Come back on a bigger screen
        </p>
        <div className="flex-1 mt-4 min-h-0">
          <SnakeGame vertical autoPlay />
        </div>
      </div>
      <FooterPanel />
    </div>
  );
}
