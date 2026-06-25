/**
 * Formats a wallet address to fixed length with ellipsis
 * @param address - Wallet address string
 * @param startChars - Number of characters to show at start (default: 10, including 0x)
 * @param endChars - Number of characters to show at end (default: 9)
 * @returns Formatted address like "0x7198d00B7...053640000"
 */
export function formatAddress(
  address: string,
  startChars: number = 10,
  endChars: number = 9
): string {
  if (!address) return '';
  
  if (address.length <= startChars + endChars) {
    return address;
  }

  const start = address.slice(0, startChars);
  const end = address.slice(-endChars);
  
  return `${start}...${end}`;
}

