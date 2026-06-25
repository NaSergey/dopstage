import { LineData } from "lightweight-charts";
import { ApiComponents } from "@/shared/api/schema";

export type ImageUrl = string | { src: string } | null | undefined;

export type ChartDataResponse = ApiComponents["PoolShareGraphResponse"][];
export type DopsDistributionStatsResponse = ApiComponents["DopsDistributionStatsResponse"];
export type ReceptorInfoResponse = ApiComponents["ProgramDopsDistributionStatsResponse"];

export type OthersSummary = {
  id: string;
  receptorsCount: number;
  accTdd: number;
} | null;

export interface ReceptorSeriesData {
  id: string;
  name: string;
  image_url: ImageUrl;
  tdd: number;
  color: string;
  data: LineData[];
  
  /**
   * Controls stacked-area layer order.
   * Lower value renders closer to the bottom (near 0%).
   */
  stackOrder?: number;

  /**
   * Controls whether the right-side icon label is rendered for this series.
   * Default: true.
   */
  showLabel?: boolean;

  /**
   * Controls whether the user can activate/select this series by clicking it.
   * Default: true.
   */
  isSelectable?: boolean;
}
