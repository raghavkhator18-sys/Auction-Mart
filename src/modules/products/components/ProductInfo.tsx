import React from 'react';
import { Clock } from 'lucide-react';
import { AuctionItem } from '@/shared/types';
import { useAuctionTimer } from '@/modules/auctions/hooks/useAuctionTimer';
import { getLotNumber } from '@/shared/utils/lotNumber';

interface ProductInfoProps {
  item: AuctionItem;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ item }) => {
  const { formatTimer } = useAuctionTimer('Auction Closed');

  return (
    <>
      {/* Header Title & Sku */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-blue-600 font-extrabold tracking-wide uppercase">{item.category}</span>
        </div>
        <div className="text-sm font-mono text-blue-600 dark:text-blue-400 font-bold tracking-wider">
          {getLotNumber(item.id, item.sku)}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-normal">{item.title}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
      </div>

      {/* Live countdown badge block */}
      <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 grid grid-cols-2 gap-4 divide-x divide-blue-200/50">
        <div>
          <span className="text-[9px] text-blue-800 font-bold uppercase tracking-wider block">AUCTION STATUS</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
            <Clock size={16} className="text-blue-600 animate-pulse" /> Live Room
          </span>
        </div>
        <div className="pl-5">
          <span className="text-[9px] text-blue-800 font-bold uppercase tracking-wider block">CLOSING TIMER</span>
          <span className="text-lg font-mono font-black text-blue-600 tracking-tight mt-1 inline-block">
            {formatTimer(item.timerSeconds)}
          </span>
        </div>
      </div>

      {/* Price telemetry and Bids statistics */}
      <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] text-slate-450 font-semibold block uppercase">CURRENT HIGHEST BID</span>
          <span className="text-3xl font-black text-blue-600">₹{item.currentBid.toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-455 text-slate-400 font-semibold block uppercase">LEDGER TRAFFIC</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{item.totalBids} bids recorded</span>
        </div>
      </div>
    </>
  );
};
