import React, { useState } from 'react';
import { AuctionItem } from '@/shared/types';
import { useAuctionMart } from '@/app/store';

interface BidFormProps {
  item: AuctionItem;
  onPlaceBid: (itemId: string, bidAmount: number, maxBid?: number) => void;
}

export const BidForm: React.FC<BidFormProps> = ({ item, onPlaceBid }) => {
  const [bidValue, setBidValue] = useState<string>('');
  const [proxyMaxBid, setProxyMaxBid] = useState<string>('');
  const { currentUser } = useAuctionMart();

  const isOwner = currentUser?.name === item.sellerName;

  const handleQuickAdd = (amount: number) => {
    const current = parseFloat(bidValue) || item.currentBid;
    setBidValue((current + amount).toString());
  };

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidValue || isOwner) return;

    const bidNum = parseFloat(bidValue);
    if (bidNum <= item.currentBid) {
      alert(`Stake must beat the current premium bid of ₹${item.currentBid.toLocaleString()}`);
      return;
    }

    const maxBidNum = proxyMaxBid ? parseFloat(proxyMaxBid) : undefined;
    onPlaceBid(item.id, bidNum, maxBidNum);

    // Clear inputs after bid completion animation
    setBidValue('');
    setProxyMaxBid('');
    alert(`Congratulations! You are now leading lot bids with an offer of ₹${bidNum.toLocaleString()}`);
  };

  if (isOwner) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">You own this listing</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Sellers cannot bid on their own items.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceBidSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="space-y-1.5">
        <label htmlFor="detail-bid-input" className="block text-[10px] uppercase font-bold text-slate-800 dark:text-slate-100 font-semibold">Your Ledger Offer (INR)</label>
        <div className="relative">
          <span className="absolute left-3.5 top-3.5 text-sm font-bold text-slate-400">₹</span>
          <input
            id="detail-bid-input"
            type="number"
            min={item.currentBid + 1}
            required
            placeholder={`Min ₹${(item.currentBid + 1).toLocaleString()}`}
            value={bidValue}
            onChange={(e) => setBidValue(e.target.value)}
            className="w-full text-sm font-bold pl-8 pr-16 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
          />
          <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-slate-400 uppercase">INR</span>
        </div>
      </div>

      {/* Quick Increment Add shortcuts */}
      <div className="space-y-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase">Quick Add increments</span>
        <div className="grid grid-cols-3 gap-2">
          {[50, 200, 1000].map((num) => (
            <button
              id={`inc-btn-${num}`}
              key={num}
              type="button"
              onClick={() => handleQuickAdd(num)}
              className="py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer"
            >
              +₹{num}
            </button>
          ))}
        </div>
      </div>

      {/* Proxy Auto Bidding capability inputs */}
      <div className="space-y-1.5 pt-1">
        <label htmlFor="detail-proxy-input" className="block text-[10px] uppercase font-bold text-slate-800 dark:text-slate-100 font-semibold">backup bid amount</label>
        <input
          id="detail-proxy-input"
          type="number"
          placeholder="system auto raises the bid if got outbid"
          value={proxyMaxBid}
          onChange={(e) => setProxyMaxBid(e.target.value)}
          className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <button
        id="detail-submit-bid"
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
      >
        Place Bid
      </button>
    </form>
  );
};
