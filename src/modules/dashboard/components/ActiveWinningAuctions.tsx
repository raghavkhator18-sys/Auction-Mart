import React from 'react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { ActiveWinningAuctionCard } from './ActiveWinningAuctionCard';

interface ActiveWinningAuctionsProps {
  myAuctionsBidOn: AuctionItem[];
  setCurrentScreen: (screen: ScreenId) => void;
  handleRecommendClick: (item: AuctionItem) => void;
}

export const ActiveWinningAuctions: React.FC<ActiveWinningAuctionsProps> = ({
  myAuctionsBidOn,
  setCurrentScreen,
  handleRecommendClick
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Bids</h2>
        <button 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          onClick={() => setCurrentScreen('bids')}
        >
          View All Bids
        </button>
      </div>

      <div className="space-y-4">
        {myAuctionsBidOn.length > 0 ? (
          myAuctionsBidOn.map((item) => (
            <ActiveWinningAuctionCard 
              key={item.id} 
              item={item} 
              setCurrentScreen={setCurrentScreen}
              handleRecommendClick={handleRecommendClick}
            />
          ))
        ) : (
          <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">No active bids right now</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Find something you love and place a bid to see it here.</p>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
              onClick={() => setCurrentScreen('browse')}
            >
              Browse Auctions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
