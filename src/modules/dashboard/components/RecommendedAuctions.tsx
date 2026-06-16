import React from 'react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { RecommendedAuctionCard } from './RecommendedAuctionCard';
import { DASHBOARD_CONSTANTS } from '../constants/dashboardConstants';

interface RecommendedAuctionsProps {
  auctions: AuctionItem[];
  handleRecommendClick: (item: AuctionItem) => void;
  setCurrentScreen: (screen: ScreenId) => void;
  setSearchQuery?: (query: string) => void;
}

export const RecommendedAuctions: React.FC<RecommendedAuctionsProps> = ({
  auctions,
  handleRecommendClick,
  setCurrentScreen,
  setSearchQuery
}) => {
  // Mock logic to get recommended lots. In a real app, this might be a specific API call.
  const recommendedItems = auctions.slice(4, 4 + DASHBOARD_CONSTANTS.RECOMMENDED_LOTS_LIMIT);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recommended Auctions</h2>
        <p className="text-[10px] text-slate-400 mt-0.5">Picked for your premium taste</p>
      </div>

      <div className="space-y-3">
        {recommendedItems.length > 0 ? (
          recommendedItems.map((rec) => (
            <RecommendedAuctionCard 
              key={rec.id} 
              item={rec} 
              handleRecommendClick={handleRecommendClick}
              setCurrentScreen={setCurrentScreen}
            />
          ))
        ) : (
          <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
            No recommendations available.
          </div>
        )}
      </div>

      <button 
        className="w-full mt-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 transition-colors text-sm font-semibold"
        onClick={() => {
          if (setSearchQuery) setSearchQuery('');
          setCurrentScreen('browse');
        }}
      >
        Browse All Auctions
      </button>
    </div>
  );
};
