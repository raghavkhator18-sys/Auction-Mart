import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ScreenId } from '@/shared/types';

interface HeroSectionProps {
  setSearchQuery: (query: string) => void;
  setCurrentScreen: (screen: ScreenId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setSearchQuery,
  setCurrentScreen
}) => {
  const handleHeroQuickSearch = (tag: string) => {
    setSearchQuery(tag);
    setCurrentScreen('browse');
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl sm:rounded-3xl py-10 md:py-20 px-5 sm:px-12 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.05),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold tracking-wide">
          <Sparkles size={12} />
          <span>EXCEPTIONAL & RARE ACQUISITIONS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
          The Modern Marketplace for <span className="text-blue-600">Exceptional Finds</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
          Bid on verified high-value luxury watches, performance automobiles, fine collectibles and enterprise-grade tech. Audited by on-chain experts for trusted verification.
        </p>

        {/* Quick Search Tag shortcuts */}
        <div className="flex flex-col gap-2.5 pt-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Luxury Searches</span>
          <div className="flex flex-wrap gap-2">
            {['Rolex', 'Ferrari', 'Hermès Birkin', 'Leica Camera', 'Walnut Speakers'].map((tag) => (
              <button
                id={`hero-tag-${tag}`}
                key={tag}
                onClick={() => handleHeroQuickSearch(tag)}
                className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-xs transition-colors cursor-pointer font-medium"
              >
                +{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button
            id="hero-browse-cta"
            onClick={() => {
              setSearchQuery('');
              setCurrentScreen('browse');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
          >
            Explore Live Auctions <ArrowRight size={14} />
          </button>
          <button
            id="hero-sell-cta"
            onClick={() => setCurrentScreen('listings')}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
          >
            List an Auction Lot
          </button>
        </div>
      </div>

      {/* Floating Abstract Element representing pristine curation */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 h-80 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 rotate-3 shadow-md">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDevDKAQxS2pByG1MpmuQ05f3S96g6Icay09cHzcYCcs7yF5FAZxgh0Bl4f7ImbA0xcraxnceu0HTzi86ExeqpHzPgN3QNl6AQVUYrqC4lKskS7mONACQcDTNcXtU6xpLAv_w30j0a-4lyPQbMGc8JaUHyeR3sKGxznXDI7XOgeVUb0d3zaTyNz4vzrsSMtmG8v0Tr5eWnHcRYDZPbF1uFx9yOFJ6lqU5_vpsdWDiVP5ab0GvY2UCB4-I0jP8LYNSOYi5NDy0-VS5uV"
          alt="Pristine Rolex Daytona Watch Dial Detail"
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 space-y-1 text-white">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Spotlight Item</span>
          <p className="text-xs font-bold font-mono">Rolex Daytona 116500</p>
          <p className="text-[11px] text-slate-300">Current high offer: ₹34,250</p>
        </div>
      </div>
    </section>
  );
};
