"use client";

import AppSelect from "@/shared/ui/app-select";
import { useCallback, useMemo } from "react";
import GeneralInfo from "./general-info";
import ReceptorInfo from "./receptor-info";
import { SearchIcon } from "@/shared/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import InfoSkeleton from "./info-skeleton";
import { useReceptorSelection } from "../model/receptor-selection-context";
import { ChartDataResponse, DopsDistributionStatsResponse } from "./chart/model/types";
import { rqClient } from "@/shared/api/instance";
import { LONG_REFETCH_INTERVAL, STALE_TIME_BUFFER } from "@/shared/lib/constants/refetchInterval";
import { refetchInterval } from "@/shared/lib/error";

type InfoPanelProps = {
  generalInfoData: DopsDistributionStatsResponse;
  receptors: ChartDataResponse;
}

const DEFAULT_FILTER_VALUE = "all";

const useProgramStats = (programId: string | null) => {
  const INTERVAL = Number(process.env.NEXT_PUBLIC_SUBNET_FEED_INTERVAL) || LONG_REFETCH_INTERVAL;

  const {
    data,
    isLoading,
  } = rqClient.useQuery(
    "get",
    "/api/v1/main_page/dops_distribution_stats/program/{program_id}",
    {
      params: {
        path: {
          program_id: programId ?? "",
        },
      },
    },
    {
      enabled: Boolean(programId),
      keepPreviousData: true,
      refetchInterval: refetchInterval(INTERVAL),
      staleTime: INTERVAL - STALE_TIME_BUFFER,
      refetchOnReconnect: true,
    },
  );

  return { data, isLoading };
}

function InfoPanel(props: InfoPanelProps) {
  const { generalInfoData, receptors } = props;
  const { selectedReceptorId, setSelectedReceptorId } = useReceptorSelection();

  const selectedFilter =
    selectedReceptorId === null ? DEFAULT_FILTER_VALUE : selectedReceptorId;

  const { data, isLoading } = useProgramStats(selectedReceptorId);

  const handleSelectFilter = useCallback((value: string) => {
    setSelectedReceptorId(value === DEFAULT_FILTER_VALUE ? null : value);
  }, [setSelectedReceptorId]);


  const selectOptions = useMemo(
    () => [
      {
        label: "All Subnets",
        value: DEFAULT_FILTER_VALUE,
        icon: <SearchIcon />,
      },
      ...receptors.map((receptor) => ({
        label: receptor.program_name,
        value: receptor.program_id,
        icon: receptor.program_image_url,
      })),
    ],
    [receptors],
  );

  const showGeneralInfo = selectedFilter === DEFAULT_FILTER_VALUE;

  return (
    <div className="h-full flex flex-col">
      {/* Header with title */}
      <div className="pt-1 pb-1 px-5 flex items-center justify-between mb-[1px] shrink-0">
        <h3 className="text-base leading-normal text-white/30">Subnets</h3>

        {/* Search bar with dropdown arrow */}
        <div className="[@media(max-width:1500px)]:w-[230px] w-[328px] relative">
          <AppSelect
            options={selectOptions}
            value={selectedFilter}
            onChange={handleSelectFilter}
            isDisabled={isLoading}
            className="px-0 w-full"
            isSearchable={true}
            searchPlaceholder="Find subnet"
            emptySearchText="No subnet found"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {showGeneralInfo ? (
          <GeneralInfo data={generalInfoData} />
        ) : isLoading ? (
          <InfoSkeleton />
        ) : data ? (
          <ReceptorInfo data={data} />
        ) : (
          <EmptyState
            showIcon={false}
            title="No data found"
            className="h-auto"
            description="Please select a subnet to view the information"
          />
        )}
      </div>
    </div>
  );
}

export default InfoPanel;
