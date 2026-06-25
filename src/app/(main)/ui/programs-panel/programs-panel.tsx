import { serverFetchClient } from "@/shared/api/server";
import { ProgramsPanelClient } from "./ui/programs-panel-client";

async function getFeaturedPrograms() {
  try {
    const { data, error } = await serverFetchClient.GET("/api/v1/main_page/featured_programs", {
      params: { query: { limit: 13 } },
      next: { revalidate: 300 },
    });

    if (error) {
      throw new Error("Failed to fetch featured programs");
    }

    return data || [];
  } catch {
    return [];
  }
}

export async function ProgramsPanel() {
  const data = await getFeaturedPrograms();

  return (
    <div className="w-full h-[200px] min-h-[200px]">
      <ProgramsPanelClient initialData={data} />
    </div>
  );
}
