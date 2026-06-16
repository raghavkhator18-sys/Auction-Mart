import React from 'react';
import { Award, ShieldAlert, Zap } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { HeroSection } from '../components/HeroSection';
import { FeaturedAuctions } from '../components/FeaturedAuctions';
import { FeedbackForm } from '../../feedback/components/FeedbackForm';

interface LandingHomeProps {
  setCurrentScreen: (screen: ScreenId) => void;
  featuredAuctions: AuctionItem[];
  setSearchQuery: (query: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  setSelectedProduct: (item: AuctionItem) => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({
  setCurrentScreen,
  featuredAuctions,
  setSearchQuery,
  favorites,
  toggleFavorite,
  setSelectedProduct
}) => {
  const handleItemClick = (item: AuctionItem) => {
    setSelectedProduct(item);
    setCurrentScreen('product-detail');
  };

  // Luxury watch and highkey item displays
  const liveAuctions = featuredAuctions.filter(a => a.status === 'active').slice(0, 6);

  return (
    <div className="space-y-12 pb-16">

      {/* 1. Hero Spotlight Block */}
      <HeroSection
        setSearchQuery={setSearchQuery}
        setCurrentScreen={setCurrentScreen}
      />

      {/* 2. Interactive Marketplace Statistics Rail */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
        <div className="text-center p-2">
          <p className="text-2xl font-black text-blue-600">₹4.8M+</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Total Sales Volume</p>
        </div>
        <div className="text-center p-2 border-l border-slate-100 dark:border-slate-800">
          <p className="text-2xl font-black text-blue-600">1,240</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Active Collectors</p>
        </div>
        <div className="text-center p-2 border-l border-slate-100 dark:border-slate-800">
          <p className="text-2xl font-black text-blue-600">99.8%</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Verification Score</p>
        </div>
        <div className="text-center p-2 border-l border-slate-100 dark:border-slate-800">
          <p className="text-2xl font-black text-blue-600">2.4m</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Average Bid Closes</p>
        </div>
      </section>

      {/* 3. Featured Active Bids List section */}
      <FeaturedAuctions
        liveAuctions={liveAuctions}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        handleItemClick={handleItemClick}
        setSearchQuery={setSearchQuery}
        setCurrentScreen={setCurrentScreen}
      />

      {/* 4. "How It Works" & Trusted Audit Rules section */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider font-semibold">FAIR & TRANSPARENT LEDGER</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Our Trust Curation Strategy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl relative shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <Award size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">No-Reserve Verified Curation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every luxury watch, fine collectible, and rare auto listed on our network is manually authenticated by certified experts beforehand.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl relative shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Instant Bid Shield Protection</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We employ military-grade secure agents that automatically route client proxy auto-bidding schedules fairly without exposure.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl relative shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Compliance Moderation Queue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our compliance review flow monitors flagged queue assets, preventing counterfeiting, fraud, and ensuring marketplace integrity.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Feedback Form section */}
      <section className="pt-4">
        <FeedbackForm />
      </section>

    </div>
  );
};
