"use client";
import { queryClient } from "@/shared/api/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { MswProvider } from "@/shared/mocks/msw-provider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" richColors duration={1500} />
      <QueryClientProvider client={queryClient}>
        <MswProvider>{children}</MswProvider>
      </QueryClientProvider>
    </>
  );
}
