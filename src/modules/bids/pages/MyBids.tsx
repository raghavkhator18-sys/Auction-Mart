import React, { useState } from 'react';
import { Gavel, TrendingUp, AlertCircle, ArrowUpRight, Award, Trash2, Heart, CheckCircle2 } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { EmptyState } from '@/shared/components/ui/EmptyState';

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Gavel size={22} className="text-blue-600" /> Active Bidding Room
          </h1>
          <p className="text-xs text-slate-505 text-slate-500 mt-1">
            Increase your stakes instantly to secure ownership of premium rare properties.
          </p>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 text-[11px] text-blue-900 p-2.5 rounded-xl flex items-center gap-2 max-w-sm shadow-3xs">
          <TrendingUp size={16} className="text-blue-600 shrink-0" />
          <span>Real-time proxy auto-bidding engine will execute your backup bounds safely.</span>
        </div>
      </div>

      {/* 2. List of active bidded properties */}
      {myBiddedAuctions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-12 shadow-sm">
          <EmptyState
            title="Your Bidding room is empty"
            description="You haven't placed bids on any premium auctions yet. Let's unlock the main browsable vault and place a bid."
            actionText="Browse Active Vault"
            onAction={() => setCurrentScreen('browse')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBiddedAuctions.map((item) => {
            const isWinning = item.bidStatus === 'winning';
            const inputVal = biddingInputs[item.id] || '';
            const minAllowedVal = Math.ceil(item.currentBid + (item.currentBid * 0.05));

            return (
              <div
                id={`mybids-card-${item.id}`}
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >

                {/* Visual Image & Bidding leading status overlay banner */}
                <div className="relative h-48 overflow-hidden bg-slate-50 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Status Banner */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm ${isWinning
                    ? 'bg-blue-600 text-white'
                    : 'bg-rose-500 text-white animate-pulse'
                    }`}>
                    {isWinning ? '✓ leading bid' : '⚠ outbid! action required'}
                  </div>

                  {/* Category Pill */}
                  <span className="absolute bottom-3 left-3 bg-blue-600/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 font-sans">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                      <span>SKU: {item.sku}</span>
                      <span>Total bids: {item.totalBids}</span>
                    </div>
                    <h3 onClick={() => handleCardTitleClick(item)} className="text-sm font-black text-slate-900 hover:text-blue-600 cursor-pointer truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Active offers summary info */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">Your High Bid</span>
                      <span className="font-extrabold text-slate-900">₹{(item.yourBid || 0).toLocaleString()}</span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">Current Bid</span>
                      <span className="font-extrabold text-blue-650 text-blue-600">₹{item.currentBid.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Quick Stake Increase form interaction */}
                  <form onSubmit={(e) => handleIncreaseSubmit(e, item.id, item.currentBid)} className="space-y-2 pt-2 border-t border-slate-100">
                    <label htmlFor={`increase-bid-input-${item.id}`} className="block text-[10px] uppercase font-bold text-slate-450">Quick increase stakes</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-[10px] text-slate-400 font-bold">₹</span>
                        <input
                          id={`increase-bid-input-${item.id}`}
                          type="number"
                          placeholder={`Min ₹${minAllowedVal.toLocaleString()}`}
                          min={minAllowedVal}
                          value={inputVal}
                          onChange={(e) => handleIncreaseInputChange(item.id, e.target.value)}
                          className="w-full text-xs pl-5 pr-2 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50 font-semibold"
                        />
                      </div>
                      <button
                        id={`increase-bid-submit-${item.id}`}
                        type="submit"
                        className="px-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Raise Bid
                      </button>
                    </div>
                  </form>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 3. History recently finished auctions panel */}
      <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pt-4">Ended / Won Lots archive</h2>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-650 text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">MacBook Pro M2 Max Won Successfully!</h4>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Premium Lot ID #MB-PRO-MAX72. Ledger payment status verified.</p>
          </div>
        </div>
        <button
          id="claim-lot-btn"
          onClick={() => alert("Redirecting to secured Escrow delivery gateway...")}
          className="text-white bg-blue-600 hover:bg-blue-700 text-[10px] font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          Claim Ownership
        </button>
      </div>

    </div>
  );
};
