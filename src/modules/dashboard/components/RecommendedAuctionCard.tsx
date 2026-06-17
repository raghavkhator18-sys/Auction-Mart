import React from 'react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { formatCurrency } from '../utils/dashboardHelpers';
import { getLotNumber } from '@/shared/utils/lotNumber';

interface RecommendedAuctionCardProps {
  item: AuctionItem;
  handleRecommendClick: (item: AuctionItem) => void;
  setCurrentScreen: (screen: ScreenId) => void;
}

export const RecommendedAuctionCard: React.FC<RecommendedAuctionCardProps> = ({
  item,
  handleRecommendClick
}) => {
  return (
    <div 
      className="flex gap-3 p-1 rounded-xl hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 transition-colors cursor-pointer group"
      onClick={() => handleRecommendClick(item)}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-20 h-20 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow transition-shadow"
      />
      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-wider font-mono block mb-0.5">
            {getLotNumber(item.id, item.sku)}
          </span>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h4>
          <span className="inline-block px-1.5 py-0.5 mt-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold uppercase tracking-wider rounded">
            {item.category}
          </span>
        </div>
        <div className="flex justify-between items-end mt-1">
          <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.currentBid)}</div>
          <div className="text-xs text-slate-400 font-medium">{item.totalBids} bids</div>
        </div>
      </div>
    </div>
  );
};
