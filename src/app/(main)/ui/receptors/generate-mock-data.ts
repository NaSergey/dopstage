// import { LineData, Time } from "lightweight-charts";
// import { ReceptorSeriesData } from "./ui/chart/model/types";
// import { PoolShareGraphItem } from "./mock-data";

// const generateTimestamps = (daysCount: number): number[] => {
//   const timestamps: number[] = [];
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   for (let i = daysCount - 1; i >= 0; i--) {
//     const date = new Date(today);
//     date.setDate(date.getDate() - i);
//     const timestamp = Math.floor(date.getTime() / 1000);
//     timestamps.push(timestamp);
//   }

//   return timestamps;
// };

// const generateRandomColor = (): string => {
//   const letters = "0123456789ABCDEF";
//   let color = "#";
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

// export default function generateMockData(
//   daysCount: number,
//   graphData: PoolShareGraphItem[],
// ): ReceptorSeriesData[] {
//   const timestamps = generateTimestamps(daysCount);
//   const seriesCount = graphData.length;

//   if (seriesCount === 0) return [];

//   // Generate smooth-ish positive shares per series, then normalize to 100% per day.
//   // Important: do NOT reuse generateRandomValue() here (it has rare huge jumps for other purposes).
//   const MIN_SHARE = 0.01; // 0.01%
//   const RELATIVE_NOISE_STD = 0.03; // ~3% day-to-day drift

//   const randomNormal = (mean = 0, stdDev = 1): number => {
//     // Box–Muller transform
//     let u = 0;
//     let v = 0;
//     while (u === 0) u = Math.random();
//     while (v === 0) v = Math.random();
//     const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
//     return mean + z * stdDev;
//   };

//   const shares: number[] = Array.from({ length: seriesCount }, () => Math.random());

//   const normalizeTo100 = (arr: number[]): number[] => {
//     const sum = arr.reduce((acc, v) => acc + v, 0);
//     if (sum <= 0) {
//       const equal = 100 / seriesCount;
//       return arr.map(() => equal);
//     }

//     const scaled = arr.map((v) => (v / sum) * 100);
//     // Make the sum numerically stable (exactly 100) by adjusting the largest bucket.
//     const s = scaled.reduce((acc, v) => acc + v, 0);
//     const diff = 100 - s;
//     if (Math.abs(diff) > 1e-9) {
//       let maxIdx = 0;
//       for (let i = 1; i < scaled.length; i++) {
//         if (scaled[i] > scaled[maxIdx]) maxIdx = i;
//       }
//       scaled[maxIdx] = Math.max(MIN_SHARE, scaled[maxIdx] + diff);
//     }
//     return scaled;
//   };

//   // valuesBySeries[i][j] -> value for series i at day j
//   const valuesBySeries: number[][] = Array.from({ length: seriesCount }, () =>
//     Array.from({ length: daysCount }, () => 0),
//   );

//   // Day 0: random distribution
//   {
//     const day0 = normalizeTo100(shares.map((v) => Math.max(MIN_SHARE, v)));
//     for (let i = 0; i < seriesCount; i++) {
//       valuesBySeries[i][0] = day0[i];
//       shares[i] = day0[i];
//     }
//   }

//   for (let j = 0; j < daysCount; j++) {
//     if (j === 0) continue;

//     // drift shares a bit (keeping them positive), then renormalize
//     for (let i = 0; i < seriesCount; i++) {
//       const next = shares[i] * (1 + randomNormal(0, RELATIVE_NOISE_STD));
//       shares[i] = Math.max(MIN_SHARE, next);
//     }

//     const dayPercents = normalizeTo100(shares);
//     for (let i = 0; i < seriesCount; i++) {
//       valuesBySeries[i][j] = dayPercents[i];
//       shares[i] = dayPercents[i];
//     }
//   }

//   return graphData.map((item, i) => {
//     const { program_name, program_image_url, program_id } = item;
//     const tdd = item.daily_data?.[item.daily_data.length - 1]?.daily_tdd;

//     const data: LineData[] = [];

//     for (let j = 0; j < daysCount; j++) {
//       const time = timestamps[j];
//       const value = valuesBySeries[i][j];
//       data.push({ time: time as Time, value });
//     }

//     return {
//       name: program_name,
//       image_url: program_image_url,
//       id: program_id,
//       tdd,
//       color: generateRandomColor(),
//       data,
//     };
//   });
// }
