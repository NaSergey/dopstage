import Header from "@/widgets/header/header";
import Footer from "@/widgets/footer/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-[2048px] min-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] h-screen">
      <Header />
      <main className="h-full min-h-0 overflow-hidden">{children}</main>
      <Footer className="shrink-0" />
    </div>
  );
}
