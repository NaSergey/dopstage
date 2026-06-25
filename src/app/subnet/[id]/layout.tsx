import Header from "@/widgets/header/header";
import Footer from "@/widgets/footer/footer";
import { RunningLine } from "@/widgets/running-line/running-line";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen max-w-[2048px] min-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] min-h-[640px]">
      <div>
        <Header />
        <RunningLine />
      </div>
      <main className="h-full overflow-auto">{children}</main>
      <Footer className="shrink-0" />
    </div>
  );
}
