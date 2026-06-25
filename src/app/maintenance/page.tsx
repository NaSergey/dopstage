import { TetrisGame } from "@/app/maintenance/components/tetris-game";
import Logo from "@/widgets/header/components/logo";
import Wrapper from "@/shared/ui/wrapper";
import FooterPanel from "@/widgets/footer/footer-panel";

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isOff = resolvedSearchParams?.mode === "off";
  return (
    <div className="bg-zinc-950 h-full">
      <div className="py-3 w-full">
        <Wrapper>
          <div className="flex items-center">
            <Logo />
          </div>
        </Wrapper>
      </div>

      <div className="grid place-items-center min-h-[70vh] gap-4 px-4 text-center">
        <div className="text-center">
          <h1 className="text-4xl pt-4 text-zinc-50">
            {isOff ? "🚧 Something is off 🚧" : "🚧 Under Construction 🚧"}
          </h1>
          {isOff ? (
            <p className="text-zinc-50 text-xl pt-4">
              Please try again later...
            </p>
          ) : (
            <>
              <p className="text-zinc-50 text-xl pt-4">
                We&apos;re just doing a quick bit of digital plumbing.
              </p>
              <p className="text-zinc-50 text-xl font-normal">Back soon!</p>
            </>
          )}
        </div>

        <div className="my-8 mx-auto">
          <TetrisGame />
        </div>
      </div>

      <FooterPanel className="flex-shrink-0" />
    </div>
  );
}
