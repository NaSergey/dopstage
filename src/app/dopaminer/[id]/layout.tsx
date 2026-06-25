import Header from "@/widgets/header/header";
import Footer from "@/widgets/footer/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen max-w-[2048px]  min-w-[1280px] mx-auto grid grid-rows-[auto_1fr_auto] min-h-[640px]">
      <Header />
        <main className="h-full overflow-auto border-r border-zinc-800">
          {children}
        </main>
      <Footer className="shrink-0" />
    </div>
  );
}
