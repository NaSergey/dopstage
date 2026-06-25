import Link from "next/link";
import { SnakeGame } from "@/widgets/snake-games/snake-game";
import { Button } from "@/shared/ui/button";
import Logo from "@/widgets/header/components/logo";
import Wrapper from "@/shared/ui/wrapper";
import FooterPanel from "@/widgets/footer/footer-panel";

export default function NotFound() {
  return (
    <div className=" ">
      <div className="py-3 w-full">
        <Wrapper>
          <div className="flex items-center">
            <Logo />
          </div>
        </Wrapper>
      </div>

      <div className="grid place-items-center min-h-[70vh] gap-6 px-4 text-center">
        <h1 className="text-4xl text-zinc-50">
          0x00ops{" "}
          <span className="inline-block text-[22px] align-sub [letter-spacing:0.2em]">
            ▪ ▪ ▪
          </span>{" "}
          404 !
        </h1>

        <div className="my-8 mx-auto">
          <SnakeGame />
        </div>

        <Button variant="frame" className="px-32 w-[344px]">
          <Link href="/">Go to homepage</Link>
        </Button>
      </div>
      <FooterPanel className="flex-shrink-0" />
    </div>
  );
}
