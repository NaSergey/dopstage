import Header from "@/widgets/header/header";
import FooterPanel from "@/widgets/footer/footer-panel";

export default function LeaderboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen max-w-[2048px] min-w-[1280px] mx-auto flex flex-col ">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <main className="flex-1 ">{children}</main>
      <FooterPanel className="flex-shrink-0" />
    </div>
  );
}
