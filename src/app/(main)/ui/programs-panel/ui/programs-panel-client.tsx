"use client";

import { useIsMounted } from "@/shared/lib/hooks/use-is-mounted";
import Carousel from "@/shared/ui/carousel";
import { ProgramCard } from "./card";
import { ProgramsPanelSkeleton } from "./programs-panel-skeleton";
import { ApiComponents } from "@/shared/api/schema";
import { rqClient } from "@/shared/api/instance";
import { refetchInterval, refetchOnReconnect, useErrorState } from "@/shared/lib/error";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { EmptyState } from "@/shared/ui/empty-state";

interface ProgramsPanelClientProps {
    // Optional: when omitted the component fetches on the client (no SSR seed).
    initialData?: ApiComponents["TopProgramResponse"][];
}

export function ProgramsPanelClient({ initialData }: ProgramsPanelClientProps) {
    const isMounted = useIsMounted();

    const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

    const {
        data,
        isLoading,
        error,
        refetch,
    } = rqClient.useQuery(
        "get",
        "/api/v1/main_page/featured_programs",
        { params: { query: { limit: 13 } } },
        {
            keepPreviousData: true,
            refetchInterval: refetchInterval(INTERVAL),
            refetchOnReconnect: refetchOnReconnect,
            staleTime: INTERVAL - STALE_TIME_BUFFER,
            placeholderData: (prev) => prev,
            initialData,
        }
    );
    const { showReload } = useErrorState(error, isLoading);
    if (!isMounted || isLoading) {
        return <ProgramsPanelSkeleton />;
    }

    if (error || !data || data.length === 0) {
        const title = error ? "Something went wrong, please reload" : "No programs available";

        return (
            <div className="w-full h-[200px] min-h-[200px] flex items-center justify-center">
                <EmptyState
                    showIcon={true}
                    title={title}
                    onReload={showReload && refetch ? () => void refetch() : undefined}
                />
            </div>
        );
    }


    const carouselItems = data.map((program, index) => ({
        id: `${program.program_id}-${index}`,
        node: (
            <ProgramCard
                data={program}
            />
        ),
    }));

    return (
        <div className="">
            <Carousel
                items={carouselItems}
                autoplay={false}
                loop={false}
                interactive={false}
                showControls
                className="gap-0.5"
                controlsClassName="top-[34%]"
            />
        </div>
    );
}
