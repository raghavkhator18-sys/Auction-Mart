import React from 'react';
import { ArrowRight, Clock, Heart } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { useAuctionTimer } from '../hooks/useAuctionTimer';

interface FeaturedAuctionsProps {
  liveAuctions: AuctionItem[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  handleItemClick: (item: AuctionItem) => void;
  setSearchQuery: (query: string) => void;
  setCurrentScreen: (screen: ScreenId) => void;
}

export const FeaturedAuctions: React.FC<FeaturedAuctionsProps> = ({
  liveAuctions,
  favorites,
  toggleFavorite,
  handleItemClick,
  setSearchQuery,
  setCurrentScreen
}) => {
  const { formatTimer } = useAuctionTimer();

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">PREMIUM CATALOGUE</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Active Live Auctions</h2>
        </div>
        <button
          id="see-all-auctions-btn"
          onClick={() => {
            setSearchQuery('');
            setCurrentScreen('browse');
          }}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          See all live lots <ArrowRight size={14} />
        </button>
      </div>

      {/* Live Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveAuctions.map((item) => {
          const isFav = favorites.includes(item.id);
          const remaining = formatTimer(item.timerSeconds);
          return (
            <div
              id={`landing-item-card-${item.id}`}
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-56 overflow-hidden bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />

                {/* Category Pill Tag */}
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                  {item.category}
                </span>

                {/* Favorite button */}
                <button
                  id={`landing-item-fav-${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-white dark:bg-slate-900/95 backdrop-blur-xs rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Heart size={14} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
                </button>

                {/* Red/Gray Timer Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                    <Clock size={11} className="text-blue-400" /> TIMEOUT
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-400">{remaining}</span>
                </div>
              </div>

              {/* Card Content & Bid actions */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                      {item.condition}
                    </span>
                  </div>
                  <h3
                    onClick={() => handleItemClick(item)}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer line-clamp-1 mb-2"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bid State Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">CURRENT OFFER</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">₹{item.currentBid.toLocaleString()}</span>
                  </div>

                  <button
                    id={`bid-cta-btn-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Bid Detail
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
