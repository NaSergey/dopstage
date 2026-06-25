import { formatK } from "@/shared/lib/format/formatK";
import { AppImage } from "@/shared/ui/app-image";
import DopValue from "@/shared/ui/dops-value";
import { EmptyText } from "@/shared/ui/empty-text";
import { DopsDistributionStatsResponse } from "./chart/model/types";

interface GeneralInfoProps {
  data: DopsDistributionStatsResponse;
}

const EMPTY_NAME = "—";

function GeneralInfo({ data }: GeneralInfoProps) {
  const {
    total_dops_distributed,
    winner_data,
    loser_data,
  } = data;

  return (
    <div className="grid grid-cols-2 pt-2 gap-[1.5px]">
      {/* Key Metrics */}
      <div className="bg-white/20 py-5 px-5 text-right flex flex-col justify-center items-end">
        <h4 className="text-sm leading-tight text-white/30 mb-0.5">
          Total Dops Distributed
        </h4>
        <div className="text-lg font-medium text-white">
          <DopValue>
            {formatK(total_dops_distributed, 0)}
          </DopValue>
        </div>
      </div>
      <div className="bg-white/20 py-5 px-5 text-right flex flex-col justify-center items-end">
        <h4 className="text-sm leading-tight text-white/30 mb-0.5">
          Root Share
        </h4>
        <div className="text-lg font-medium text-white">
            {/* {formatK(today_allocation, 0)} */}
             80%
        </div>
      </div>
      {/* Winner */}
      <div className="bg-[#11220A] p-5 text-right">
        <h4 className="text-sm leading-tight text-white/30">Winner</h4>

        <div className="flex items-center gap-1.5 justify-end my-0.5">
          <DopValue iconClassName="size-6">
            <span className="text-lg font-medium text-lime-500">
              <EmptyText value={winner_data?.tde} formatter={(v) => formatK(v, 0)} />
            </span>
          </DopValue>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <AppImage
            src={winner_data?.yapper_logo_url}
            alt={winner_data?.yapper_display_name ?? EMPTY_NAME}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm text-white truncate" title={winner_data?.yapper_display_name ?? EMPTY_NAME}>
            {winner_data?.yapper_display_name ?? EMPTY_NAME}
          </span>
        </div>
      </div>
      {/* Looser */}
      <div className="bg-[#3A0711] p-5 text-right">
        <h4 className="text-sm leading-tight text-white/30">Looser</h4>

        <div className="flex items-center gap-1.5 justify-end my-0.5">
          <DopValue iconClassName="size-6">
            <span className="text-lg font-medium text-red-500">
              <EmptyText value={loser_data?.tde} formatter={(v) => formatK(v, 0)} />
            </span>
          </DopValue>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <AppImage
            src={loser_data?.yapper_logo_url}
            alt={loser_data?.yapper_display_name ?? EMPTY_NAME}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm leading-normal text-white truncate" title={loser_data?.yapper_display_name ?? EMPTY_NAME}>
            {loser_data?.yapper_display_name ?? EMPTY_NAME}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfo;
