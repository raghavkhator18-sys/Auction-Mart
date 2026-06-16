import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { AuctionItem } from '@/shared/types';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { CardSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { AuctionCard } from './AuctionCard';

interface AuctionGridProps {
  sortedAuctions: AuctionItem[];
  isLoading: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  handleCardClick: (item: AuctionItem) => void;
  resetFilters: () => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export const AuctionGrid: React.FC<AuctionGridProps> = ({
  sortedAuctions,
  isLoading,
  favorites,
  toggleFavorite,
  handleCardClick,
  resetFilters,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="lg:col-span-3 space-y-5">
      {/* Grid control bar: counts, sorts */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white">{sortedAuctions.length}</strong> rare lots matching filters
        </p>

        <div className="flex items-center gap-2">
          <div className="text-slate-400 shrink-0">
            <ArrowUpDown size={14} />
          </div>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg focus:outline-hidden focus:border-blue-600 cursor-pointer text-slate-700 dark:text-slate-200 shadow-2xs"
          >
            <option value="traffic">Most Popular (Bids)</option>
            <option value="price-low">Lowest Offer Price</option>
            <option value="price-high">Highest Offer Price</option>
            <option value="ending">Closing Soonest</option>
          </select>
        </div>
      </div>

      {/* Core Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : sortedAuctions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-12 shadow-sm">
          <EmptyState
            title="No matching auctions found"
            description="We couldn't locate any rare lots matching your search terms. Let's try reset filters to unlock full premium vault."
            actionText="Reset All Filters"
            onAction={resetFilters}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAuctions.map((item) => (
            <AuctionCard
              key={item.id}
              item={item}
              isFav={favorites.includes(item.id)}
              toggleFavorite={toggleFavorite}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
