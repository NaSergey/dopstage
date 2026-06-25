import { serverFetchClient } from "@/shared/api/server";
import { TopTweetsPanelClient } from "./ui/top-tweets-panel-client";

async function getTopTweets() {
  try {
    const { data, error } = await serverFetchClient.GET("/api/v1/main_page/top_tweets", {
      next: { revalidate: 300 },
    });

    if (error) {
      throw new Error("Failed to fetch top tweets");
    }

    return data || [];
  } catch {
    return [];
  }
}

export default async function TopTweetsPanel() {
  const data = await getTopTweets();

  return (
    <div className="bg-zinc-950 w-full pt-3">
      <p className="pl-4 text-base font-medium mb-3">Top Tweets</p>
      <TopTweetsPanelClient initialData={data} />
    </div>
  );
}
