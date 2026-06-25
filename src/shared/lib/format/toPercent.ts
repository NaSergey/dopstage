import { formatK } from "./formatK";

function toPercent(val: number, decimals = 2) {
  const value = val * 100;
  if (Math.abs(value) >= 1000) {
    return formatK(value, 1) + "%";
  }
  return value.toFixed(value >= 1 || value === 0 ? 0 : decimals) + "%";
}

export default toPercent;
