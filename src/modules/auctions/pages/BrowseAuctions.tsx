import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Clock, RotateCcw, Heart } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { CategoryPills } from '@/shared/components/ui/CategoryPills';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { CardSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { useAuctionTimer } from '@/shared/hooks/useAuctionTimer';

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
  const [sortBy, setSortBy] = useState<string>('traffic'); // 'traffic', 'price-low', 'price-high', 'ending'
  const { formatTimer } = useAuctionTimer();

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
    setSortBy('traffic');
  };

  // Main filter pipeline
  const filteredAuctions = auctions.filter((item) => {
    // Only browse active auctions
    if (item.status !== 'active') return false;

    // Search query
    const matchSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category match
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // Price query
    const itemPrice = item.currentBid;
    const matchMinPrice = minPrice === '' || itemPrice >= parseFloat(minPrice);
    const matchMaxPrice = maxPrice === '' || itemPrice <= parseFloat(maxPrice);

    // Condition match
    const matchCondition = selectedConditions.length === 0 || selectedConditions.includes(item.condition);

    return matchSearch && matchCategory && matchMinPrice && matchMaxPrice && matchCondition;
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
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Premium Bidding Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ledger of verified high-luxury objects under live auctions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryPills selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
      </div>

      {/* 2. Main Body: Left Sidebar + Right Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar Filter Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 sticky top-20 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-slate-150">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <SlidersHorizontal size={14} className="text-blue-600" /> Filter
            </span>
            <button
              id="reset-filter-side-btn"
              onClick={resetFilters}
              className="text-[10px] text-slate-400 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label htmlFor="side-search-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keyword match</label>
            <div className="relative">
              <input
                id="side-search-input"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
              />
              <Search size={12} className="absolute left-2.5 top-3 text-slate-400" />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Bounds (INR)</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[10px] text-slate-400 font-bold">₹</span>
                <input
                  id="side-price-min-input"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-xs pl-5 pr-2 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50"
                />
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[10px] text-slate-400 font-bold">₹</span>
                <input
                  id="side-price-max-input"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs pl-5 pr-2 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Conditions checkboxes */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Condition</label>
            <div className="space-y-1.5">
              {['New', 'Used'].map((cond) => {
                const checked = selectedConditions.includes(cond);
                return (
                  <label key={cond} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      id={`checkbox-condition-${cond}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCondition(cond)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500/20"
                    />
                    <span>{cond}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Certifications assurances removed per request */}
        </div>

        {/* Right Main Grid Workspace */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Grid control bar: counts, sorts */}
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Showing <strong className="text-slate-900">{sortedAuctions.length}</strong> rare lots matching filters
            </p>

            <div className="flex items-center gap-2">
              <div className="text-slate-400 shrink-0">
                <ArrowUpDown size={14} />
              </div>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg focus:outline-hidden focus:border-blue-600 cursor-pointer text-slate-700 shadow-2xs"
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
            <div className="bg-white border border-slate-200 rounded-2xl py-12 shadow-sm">
              <EmptyState
                title="No matching auctions found"
                description="We couldn't locate any rare lots matching your search terms. Let's try reset filters to unlock full premium vault."
                actionText="Reset All Filters"
                onAction={resetFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAuctions.map((item) => {
                const isFav = favorites.includes(item.id);
                const remaining = formatTimer(item.timerSeconds);
                return (
                  <div
                    id={`browse-item-card-${item.id}`}
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                  >
                    
                    {/* Visual */}
                    <div className="relative h-52 overflow-hidden bg-slate-50 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        {item.category}
                      </span>

                      <button
                        id={`browse-item-fav-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-white/95 backdrop-blur-xs rounded-full text-slate-500 hover:text-rose-500 transition-colors shadow-xs cursor-pointer"
                      >
                        <Heart size={13} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
                      </button>

                      {/* Timer ribbon */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-white">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-300">
                          <Clock size={10} className="text-blue-400" /> TIME REMAINING
                        </span>
                        <span className="text-[11px] font-mono font-bold text-blue-400">{remaining}</span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-450 font-mono font-semibold">{item.sku}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded">
                            {item.condition}
                          </span>
                        </div>
                        <h3
                          onClick={() => handleCardClick(item)}
                          className="text-xs sm:text-sm font-black text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                        >
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer state row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-[9px] text-slate-400 font-medium">CURRENT BID</p>
                          <p className="text-sm font-extrabold text-slate-900">₹{item.currentBid.toLocaleString()}</p>
                        </div>
                        <button
                          id={`browse-item-detail-${item.id}`}
                          onClick={() => handleCardClick(item)}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Grab now!
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
