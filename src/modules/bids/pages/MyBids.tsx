import React, { useState } from 'react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { MyBidsHeader } from '../components/MyBidsHeader';
import { BidCard } from '../components/BidCard';
import { BidsHistory } from '../components/BidsHistory';

interface MyBidsProps {
  auctions: AuctionItem[];
  onBidIncrease: (id: string, newAmount: number) => void;
  setCurrentScreen: (screen: ScreenId) => void;
  setSelectedProduct: (item: AuctionItem) => void;
}

export const MyBids: React.FC<MyBidsProps> = ({
  auctions,
  onBidIncrease,
  setCurrentScreen,
  setSelectedProduct
}) => {
  const [biddingInputs, setBiddingInputs] = useState<Record<string, string>>({});

  // Only select items that you placed a bid on
  const myBiddedAuctions = auctions.filter((item) => item.yourBid !== undefined);

  const handleIncreaseInputChange = (id: string, value: string) => {
    setBiddingInputs({
      ...biddingInputs,
      [id]: value
    });
  };

  const handleIncreaseSubmit = (e: React.FormEvent, id: string, currentAmount: number) => {
    e.preventDefault();
    const bidValue = biddingInputs[id];
    if (!bidValue) return;

    const parsedBid = parseFloat(bidValue);
    if (parsedBid <= currentAmount) {
      alert(`Your increased bid must beat the current premium bid of ₹${currentAmount.toLocaleString()}`);
      return;
    }

    onBidIncrease(id, parsedBid);
    handleIncreaseInputChange(id, ''); // reset input
  };

  const handleCardTitleClick = (item: AuctionItem) => {
    setSelectedProduct(item);
    setCurrentScreen('product-detail');
  };

  return (
    <div className="space-y-6 pb-16">

      {/* 1. Header and alert message */}
      <MyBidsHeader />

      {/* 2. List of active bidded properties */}
      {myBiddedAuctions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-12 shadow-sm">
          <EmptyState
            title="No Bids Yet"
            description="Browse auctions and place your first bid."
            actionText="Browse Auctions"
            onAction={() => setCurrentScreen('browse')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBiddedAuctions.map((item) => (
            <BidCard
              key={item.id}
              item={item}
              inputVal={biddingInputs[item.id] || ''}
              handleIncreaseInputChange={handleIncreaseInputChange}
              handleIncreaseSubmit={handleIncreaseSubmit}
              handleCardTitleClick={handleCardTitleClick}
            />
          ))}
        </div>
      )}

      {/* 3. History recently finished auctions panel */}
      <BidsHistory />

    </div>
  );
};
