import Header from "@/widgets/header/header";
import FooterPanel from "@/widgets/footer/footer-panel";
import { RunningLine } from "@/widgets/running-line/running-line";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen max-w-[2048px] min-w-[1280px] mx-auto flex flex-col">
      <div className="flex-shrink-0 w-full">
        <Header />
        <RunningLine />
      </div>
      <main className="flex-1">{children}</main>
      <FooterPanel className="flex-shrink-0 w-full" />
    </div>
  );
}
