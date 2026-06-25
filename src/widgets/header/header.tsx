import HeaderSearch from "./components/header-search";
import Logo from "./components/logo";
import Link from "next/link";
import Wrapper from "@/shared/ui/wrapper";
import Auth from "@/features/auth/auth";

function Header() {
  return (
    <header className=" bg-zinc-950 w-full z-150">
      <Wrapper>
        <nav className="relative flex justify-between items-center gap-4 w-full h-12">
          <div className="flex min-w-0 items-center gap-10">
            <Logo />
            <Link
              href="/graph"
              className="text-sm hover:opacity-70 transition-opacity"
            >
              Social Graph
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm hover:opacity-70 transition-opacity"
            >
              Leaderboard
            </Link>
          </div>

          <HeaderSearch className="absolute left-1/2 z-[150] -translate-x-1/2 mx-auto w-full max-w-md" />

          <div className="flex items-center gap-2">
            <Auth />
          </div>
        </nav>
      </Wrapper>
    </header>
  );
}

export default Header;
