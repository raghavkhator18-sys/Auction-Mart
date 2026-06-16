import { useMemo } from 'react';
import { AuctionItem } from '@/shared/types';

export const useListingStats = (myRealListings: AuctionItem[]) => {
  return useMemo(() => {
    const activeCount = myRealListings.filter(i => i.status === 'active').length;
    const draftCount = myRealListings.filter(i => i.status === 'draft').length;
    const soldCount = myRealListings.filter(i => i.status === 'ended').length;
    const totalRevenue = myRealListings
      .filter(i => i.status === 'ended')
      .reduce((sum, i) => sum + i.currentBid, 0);

    return { activeCount, draftCount, soldCount, totalRevenue };
  }, [myRealListings]);
};
