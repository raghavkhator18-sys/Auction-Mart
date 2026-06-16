import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, Grid2X2, Tag, IndianRupee, Clock3 } from 'lucide-react';
import { CATEGORIES, DURATION_OPTIONS } from '../../my-listings/constants/listingConstants';

interface AuctionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  selectedConditions: string[];
  toggleCondition: (cond: string) => void;
  selectedDuration: number | '';
  setSelectedDuration: (val: number | '') => void;
  resetFilters: () => void;
}

export const AuctionFilters: React.FC<AuctionFiltersProps> = ({
  searchQuery, setSearchQuery,
  selectedCategory, setSelectedCategory,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  selectedConditions, toggleCondition,
  selectedDuration, setSelectedDuration,
  resetFilters
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-6 sticky top-20 shadow-sm">
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-150 dark:border-slate-700/50">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <SlidersHorizontal size={16} className="text-blue-600" /> Auction Filters
          </span>
          <button
            id="reset-filter-side-btn"
            onClick={resetFilters}
            className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 hover:bg-blue-50 px-2 py-1 rounded-md"
          >
            <RotateCcw size={12} /> Reset Filters
          </button>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Find auctions based on category, condition, bid range, and duration.
        </p>
      </div>

      {/* 1. Product Name */}
      <div className="space-y-2">
        <label htmlFor="side-search-input" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Search size={14} className="text-slate-400" /> Product Name
        </label>
        <div className="relative">
          <input
            id="side-search-input"
            type="text"
            placeholder="Search by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-white dark:bg-slate-900"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* 2. Category */}
      <div className="space-y-2">
        <label htmlFor="filter-category" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Grid2X2 size={14} className="text-slate-400" /> Category
        </label>
        <select
          id="filter-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-white dark:bg-slate-900"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 3. Condition */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Tag size={14} className="text-slate-400" /> Condition
        </label>
        <div className="flex gap-4">
          {['New', 'Used'].map((cond) => {
            const checked = selectedConditions.includes(cond);
            return (
              <label key={cond} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                <input
                  id={`checkbox-condition-${cond}`}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCondition(cond)}
                  className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500/20"
                />
                <span>{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Starting Bid Range */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <IndianRupee size={14} className="text-slate-400" /> Starting Bid Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
            <input
              id="side-price-min-input"
              type="number"
              placeholder="Min Bid"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full text-xs pl-6 pr-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white dark:bg-slate-900"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
            <input
              id="side-price-max-input"
              type="number"
              placeholder="Max Bid"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full text-xs pl-6 pr-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 5. Auction Duration */}
      <div className="space-y-2">
        <label htmlFor="filter-duration" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Clock3 size={14} className="text-slate-400" /> Auction Duration
        </label>
        <select
          id="filter-duration"
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value ? Number(e.target.value) : '')}
          className="w-full text-xs px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-white dark:bg-slate-900"
        >
          <option value="">Any Duration</option>
          {DURATION_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

    </div>
  );
};
