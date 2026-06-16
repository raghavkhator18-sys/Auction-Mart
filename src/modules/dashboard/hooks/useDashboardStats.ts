import { useMemo } from 'react';
import { AuctionItem } from '@/shared/types';
import { DashboardStatData } from '../types/dashboard.types';
import { formatCurrency } from '../utils/dashboardHelpers';
import { useAuctionMart } from '@/app/store';

export const useDashboardStats = (auctions: AuctionItem[] = []) => {
  const { userBids, favorites } = useAuctionMart();

  return useMemo(() => {
    // Only count auctions the user has actually bid on (from persisted bids)
    const biddedAuctionIds = new Set(userBids.map(b => b.auction_id));
    const myAuctionsBidOn = auctions.filter((item) => biddedAuctionIds.has(item.id));
    const totalMyBidsCount = myAuctionsBidOn.length;
    const currentWinningCount = userBids.filter((b) => b.bid_status === 'winning').length;

    // Compute total spend from actual winning bids
    const spentEst = userBids
      .filter(b => b.bid_status === 'winning')
      .reduce((sum, b) => sum + b.bid_amount, 0);

    const watchlistCount = favorites.length;

    const stats: DashboardStatData[] = [
      {
        title: 'Active Bids',
        value: totalMyBidsCount,
        description: 'Currently placed bids',
        iconName: 'Gavel',
      },
      {
        title: 'Items Won',
        value: currentWinningCount,
        description: 'Completed and won auctions',
        iconName: 'Trophy',
      },
      {
        title: 'Total Spend',
        value: formatCurrency(spentEst),
        description: 'Amount spent on won items',
        iconName: 'Wallet',
      },
      {
        title: 'Watchlist Items',
        value: watchlistCount,
        description: 'Items you are monitoring',
        iconName: 'Heart',
      },
    ];

    return {
      stats,
      myAuctionsBidOn,
      totalMyBidsCount,
      currentWinningCount,
      spentEst
    };
  }, [auctions, userBids, favorites]);
};
