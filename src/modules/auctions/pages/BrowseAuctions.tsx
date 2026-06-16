import React, { useState, useEffect } from 'react';
import { Gavel, Clock3, CalendarDays, Archive, Heart } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { AuctionFilters } from '../components/AuctionFilters';
import { AuctionGrid } from '../components/AuctionGrid';

interface BrowseAuctionsProps {
  auctions: AuctionItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  setSelectedProduct: (item: AuctionItem) => void;
  setCurrentScreen: (screen: ScreenId) => void;
}

export const BrowseAuctions: React.FC<BrowseAuctionsProps> = ({
  auctions,
  searchQuery,
  setSearchQuery,
  favorites,
  toggleFavorite,
  setSelectedProduct,
  setCurrentScreen
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [sortBy, setSortBy] = useState<string>('traffic'); // 'traffic', 'price-low', 'price-high', 'ending'

  const toggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter(c => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedConditions([]);
    setSelectedDuration('');
    setSortBy('traffic');
  };

  // Main filter pipeline
  const filteredAuctions = auctions.filter((item) => {
    // 1. Status/Watchlist matching
    if (selectedStatus === 'watchlist') {
      if (!favorites.includes(item.id)) return false;
    } else if (selectedStatus === 'active') {
      if (item.status !== 'active') return false;
    } else if (selectedStatus === 'ending_soon') {
      if (item.status !== 'active' || item.timerSeconds > 86400) return false;
    } else if (selectedStatus === 'coming_soon') {
      if (item.status !== 'draft') return false; // Assuming 'draft' means coming soon, or adjust logic
    } else if (selectedStatus === 'ended') {
      if (item.status !== 'ended') return false;
    }

    // 2. Search query
    const matchSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 3. Category match
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // 4. Price query
    const itemPrice = item.currentBid;
    const matchMinPrice = minPrice === '' || itemPrice >= parseFloat(minPrice);
    const matchMaxPrice = maxPrice === '' || itemPrice <= parseFloat(maxPrice);

    // 5. Condition match
    const matchCondition = selectedConditions.length === 0 || selectedConditions.includes(item.condition);

    // 6. Duration match (If applicable, assuming item has timerSeconds or we ignore it if not fully mapped, but we'll apply it loosely)
    const matchDuration = selectedDuration === '' || item.timerSeconds <= Number(selectedDuration);

    return matchSearch && matchCategory && matchMinPrice && matchMaxPrice && matchCondition && matchDuration;
  });

  // Sort pipeline
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.currentBid - b.currentBid;
    }
    if (sortBy === 'price-high') {
      return b.currentBid - a.currentBid;
    }
    if (sortBy === 'ending') {
      return a.timerSeconds - b.timerSeconds;
    }
    // Default 'traffic': sorting by total bid popularity
    return b.totalBids - a.totalBids;
  });

  const handleCardClick = (item: AuctionItem) => {
    setSelectedProduct(item);
    setCurrentScreen('product-detail');
  };

  // Local loading simulation for skeletons (replace with real loading flag if available)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header Banner & Status Tabs */}
      <div className="flex flex-col gap-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
            <Gavel size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Browse Auctions</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Discover active auctions, upcoming listings, and recently ended auctions.
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'active', name: 'Active Auctions', icon: <Gavel size={14} /> },
            { id: 'ending_soon', name: 'Ending Soon', icon: <Clock3 size={14} /> },
            { id: 'coming_soon', name: 'Coming Soon', icon: <CalendarDays size={14} /> },
            { id: 'ended', name: 'Ended Auctions', icon: <Archive size={14} /> },
            { id: 'watchlist', name: 'Watchlist', icon: <Heart size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 hover:text-slate-900 dark:text-white'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Body: Left Sidebar + Right Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar Filter Section */}
        <AuctionFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          selectedConditions={selectedConditions}
          toggleCondition={toggleCondition}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          resetFilters={resetFilters}
        />

        {/* Right Main Grid Workspace */}
        <AuctionGrid
          sortedAuctions={sortedAuctions}
          isLoading={isLoading}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          handleCardClick={handleCardClick}
          resetFilters={resetFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
    </div>
  );
};
