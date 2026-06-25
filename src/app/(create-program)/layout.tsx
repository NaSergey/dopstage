
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-[2048px] min-w-[1280px] mx-auto flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

