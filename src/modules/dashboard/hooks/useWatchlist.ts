import { useMemo } from 'react';
import { AuctionItem } from '@/shared/types';

export const useWatchlist = (auctions: AuctionItem[] = []) => {
  return useMemo(() => {
    // For this refactor, we are using a simulated watchlist based on a slice of active auctions
    // In a real scenario, this would filter by an `isWatchlisted` flag or call an API
    const watchlistItems = auctions.filter(a => a.status === 'active').slice(0, 4);

    return {
      watchlistItems,
      watchlistCount: watchlistItems.length,
    };
  }, [auctions]);
};
