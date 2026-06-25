import { RunningLineClient } from "./components/running-line-client";
import { ApiComponents } from "@/shared/api/schema";
import { serverFetchClient } from "@/shared/api/server";

type RunningLineItem = ApiComponents["RunningLineItemResponse"];

async function getRunningLine(): Promise<RunningLineItem[]> {
  try {
    const { data, error } = await serverFetchClient.GET(
      "/api/v1/common/running_line",
      {
        next: { revalidate: 60 },
      },
    );

    if (error || !Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

export async function RunningLine() {
  const data = await getRunningLine();

  return (
    <div className="[@media(max-height:800px)]:h-7 h-8">
      <RunningLineClient initialData={data} />
    </div>
  );
}
