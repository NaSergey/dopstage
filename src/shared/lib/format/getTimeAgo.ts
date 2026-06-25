function getTimeAgo(ts: number) {
  ts = typeof ts === "number" ? ts : Number(ts);
  if (ts < 1e12) ts *= 1000;

  const diff = Date.now() - ts;
  const abs = Math.abs(diff);

  const units: [string, string, number][] = [
    ["yr", "yrs", 365 * 24 * 60 * 60 * 1000],
    ["month", "months", 30 * 24 * 60 * 60 * 1000],
    ["wk", "wks", 7 * 24 * 60 * 60 * 1000],
    ["day", "days", 24 * 60 * 60 * 1000],
    ["hr", "hrs", 60 * 60 * 1000],
    ["min", "mins", 60 * 1000],
    ["sec", "secs", 1000],
  ];

  for (const [singular, plural, ms] of units) {
    if (abs >= ms) {
      const n = Math.floor(abs / ms);
      const u = n === 1 ? singular : plural;
      return diff >= 0 ? `${n} ${u}` : `in ${n} ${u}`;
    }
  }
  return "now";
}

export default getTimeAgo;
