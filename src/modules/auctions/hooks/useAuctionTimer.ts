import { useEffect, useState } from 'react';
import { formatAuctionTimer } from '../utils/formatAuctionTimer';

export const useAuctionTimer = (endedLabel = 'Ended') => {
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (initialSeconds: number) =>
    formatAuctionTimer(initialSeconds, ticker, endedLabel);

  return { ticker, formatTimer };
};
