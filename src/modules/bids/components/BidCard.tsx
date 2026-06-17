import React from 'react';
import { AuctionItem } from '@/shared/types';
import { getLotNumber } from '@/shared/utils/lotNumber';

interface BidCardProps {
  item: AuctionItem;
  inputVal: string;
  handleIncreaseInputChange: (id: string, value: string) => void;
  handleIncreaseSubmit: (e: React.FormEvent, id: string, currentAmount: number) => void;
  handleCardTitleClick: (item: AuctionItem) => void;
}

export const BidCard: React.FC<BidCardProps> = ({
  item,
  inputVal,
  handleIncreaseInputChange,
  handleIncreaseSubmit,
  handleCardTitleClick
}) => {
  const isWinning = item.bidStatus === 'winning';
  const minAllowedVal = Math.ceil(item.currentBid + (item.currentBid * 0.05));

  return (
    <div
      id={`mybids-card-${item.id}`}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      {/* Visual Image & Bidding leading status overlay banner */}
      <div className="relative h-40 sm:h-48 overflow-hidden bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 shrink-0">
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
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-medium">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider">{getLotNumber(item.id, item.sku)}</span>
            <span>Total bids: {item.totalBids}</span>
          </div>
          <h3 onClick={() => handleCardTitleClick(item)} className="text-sm font-black text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer truncate">
            {item.title}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Active offers summary info */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-150 dark:border-slate-700/50 text-xs">
          <div>
            <span className="text-[9px] text-slate-400 block uppercase font-medium">Your High Bid</span>
            <span className="font-extrabold text-slate-900 dark:text-white">₹{(item.yourBid || 0).toLocaleString()}</span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-[9px] text-slate-400 block uppercase font-medium">Current Bid</span>
            <span className="font-extrabold text-blue-650 text-blue-600">₹{item.currentBid.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Stake Increase form interaction */}
        <form onSubmit={(e) => handleIncreaseSubmit(e, item.id, item.currentBid)} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                className="w-full text-xs pl-5 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 font-semibold"
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
};
