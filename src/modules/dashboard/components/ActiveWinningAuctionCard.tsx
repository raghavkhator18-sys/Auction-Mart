import React from 'react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { formatCurrency, getTimeRemaining } from '../utils/dashboardHelpers';
import { getLotNumber } from '@/shared/utils/lotNumber';

interface ActiveWinningAuctionCardProps {
  item: AuctionItem;
  setCurrentScreen: (screen: ScreenId) => void;
  handleRecommendClick: (item: AuctionItem) => void;
}

export const ActiveWinningAuctionCard: React.FC<ActiveWinningAuctionCardProps> = ({
  item,
  setCurrentScreen,
  handleRecommendClick
}) => {
  const isWinning = item.bidStatus === 'winning';
  const isOutbid = item.bidStatus === 'outbid';

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 items-center hover:shadow-md transition-shadow group">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-20 h-20 rounded-lg object-cover bg-white dark:bg-slate-900 shadow-sm"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-wider font-mono block mb-0.5">
              {getLotNumber(item.id, item.sku)}
            </span>
            <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isWinning ? 'bg-emerald-100 text-emerald-700' :
                  isOutbid ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-200 text-slate-700 dark:text-slate-200'
                }`}>
                {isWinning ? 'Winning' : isOutbid ? 'Outbid' : 'Watching'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                ⏱ {getTimeRemaining(item.timerText)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Current Bid</p>
            <p className="font-bold text-slate-900 dark:text-white text-lg leading-none">{formatCurrency(item.currentBid)}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <button
            className="flex-1 py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:bg-slate-800 transition-colors"
            onClick={() => handleRecommendClick(item)}
          >
            View Details
          </button>
          <button
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${isWinning
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
              }`}
            onClick={() => handleRecommendClick(item)}
          >
            {isWinning ? 'Increase Max Bid' : 'Bid Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ₹