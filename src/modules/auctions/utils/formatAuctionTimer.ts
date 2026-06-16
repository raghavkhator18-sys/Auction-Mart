export const formatAuctionTimer = (
  initialSeconds: number,
  ticker: number,
  endedLabel = 'Ended'
): string => {
  const remaining = Math.max(0, initialSeconds - ticker);
  if (remaining === 0) return endedLabel;
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
