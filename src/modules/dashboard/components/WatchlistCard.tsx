import React from 'react';
import { AuctionItem } from '@/shared/types';
import { formatCurrency, getTimeRemaining } from '../utils/dashboardHelpers';
import { getLotNumber } from '@/shared/utils/lotNumber';

interface WatchlistCardProps {
  item: AuctionItem;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({ item }) => {
  return (
    <div className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:border-slate-800 group cursor-pointer">
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow transition-shadow"
        />
        {item.timerSeconds < 3600 && item.status === 'active' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 py-0.5">
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-wider font-mono block mb-0.5">
          {getLotNumber(item.id, item.sku)}
        </span>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h4>
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{formatCurrency(item.currentBid)}</span>
          <span className={`text-[10px] font-medium ${item.timerSeconds < 3600 ? 'text-rose-600' : 'text-slate-500 dark:text-slate-400'}`}>
            {getTimeRemaining(item.timerText)}
          </span>
        </div>
      </div>
    </div>
  );
};
