"use client";

import { useQuery } from "@tanstack/react-query";
import UserGraph from "@/app/graph/components/user-graph";
import type { ApiNode, ApiLink } from "@/app/graph/components/model/types";
import { enableMocking } from "@/shared/mocks/enable-mocking";

interface GraphDataResponse {
  nodes: ApiNode[];
  links: ApiLink[];
}

const EMPTY_GRAPH: GraphDataResponse = { nodes: [], links: [] };

export default function MainPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["graph_data"],
    queryFn: async (): Promise<GraphDataResponse> => {
      // Wait for the MSW worker so the request resolves to the fixture instead
      // of leaking to the real network on first paint.
      await enableMocking();
      const res = await fetch("https://mock-api.dop.wtf/api/v1/common/graph_data");
      if (!res.ok) return EMPTY_GRAPH;
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const graph = data ?? EMPTY_GRAPH;

  return (
    <div className="flex flex-col w-full h-full min-w-[1280px] max-w-[2048px] mx-auto">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center bg-[#09090B]">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <UserGraph nodes={graph.nodes} links={graph.links} />
      )}
    </div>
  );
}
