import React from 'react';
import { useAuctionTimer } from '@/shared/hooks/useAuctionTimer';
import { Sparkles, ArrowRight, Gavel, Award, ShieldAlert, Zap, Hourglass, Star, Clock, Heart, Search } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';

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
  const { formatTimer } = useAuctionTimer();

  const handleHeroQuickSearch = (tag: string) => {
    setSearchQuery(tag);
    setCurrentScreen('browse');
  };

  const handleItemClick = (item: AuctionItem) => {
    setSelectedProduct(item);
    setCurrentScreen('product-detail');
  };

  // Luxury watch and highkey item displays
  const liveAuctions = featuredAuctions.filter(a => a.status === 'active').slice(0, 6);

  return (
    <div className="space-y-12 pb-16">

      {/* 1. Hero Spotlight Block */}
      <section className="relative overflow-hidden bg-white text-slate-800 rounded-3xl py-12 md:py-20 px-6 sm:px-12 shadow-sm border border-slate-200">

        {/* Subtle glowing grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.05),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 font-semibold tracking-wide">
            <Sparkles size={12} />
            <span>EXCEPTIONAL & RARE ACQUISITIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
            The Modern Marketplace for <span className="text-blue-600">Exceptional Finds</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
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
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg px-3 py-1 text-xs transition-colors cursor-pointer font-medium"
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
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
            >
              List an Asset
            </button>
          </div>
        </div>

        {/* Floating Abstract Element representing pristine curation */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 h-80 bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 rotate-3 shadow-md">
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

      {/* 2. Interactive Marketplace Statistics Rail */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="text-center p-2">
          <p className="text-2xl font-black text-blue-600">₹4.8M+</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Total Sales Volume</p>
        </div>
        <div className="text-center p-2 border-l border-slate-100">
          <p className="text-2xl font-black text-blue-600">1,240</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Active Collectors</p>
        </div>
        <div className="text-center p-2 border-l border-slate-100">
          <p className="text-2xl font-black text-blue-600">99.8%</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Verification Score</p>
        </div>
        <div className="text-center p-2 border-l border-slate-100">
          <p className="text-2xl font-black text-blue-600">2.4m</p>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Average Bid Closes</p>
        </div>
      </section>

      {/* 3. Featured Active Bids List section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">PREMIUM CATALOGUE</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Active Live Auctions</h2>
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
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-slate-50 shrink-0">
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
                    className="absolute top-3 right-3 p-1.5 bg-white/95 backdrop-blur-xs rounded-full text-slate-500 hover:text-rose-500 border border-slate-200 transition-colors shadow-xs cursor-pointer"
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
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">{item.sku}</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                        {item.condition}
                      </span>
                    </div>
                    <h3
                      onClick={() => handleItemClick(item)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1 mb-2"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bid State Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">CURRENT OFFER</span>
                      <span className="text-sm font-black text-slate-900">₹{item.currentBid.toLocaleString()}</span>
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

      {/* 4. "How It Works" & Trusted Audit Rules section */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider font-semibold">FAIR & TRANSPARENT LEDGER</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Trust Curation Strategy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl relative shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <Award size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">No-Reserve Verified Curation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every luxury watch, fine collectible, and rare auto listed on our network is manually authenticated by certified experts beforehand.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl relative shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Instant Bid Shield Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We employ military-grade secure agents that automatically route client proxy auto-bidding schedules fairly without exposure.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl relative shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Compliance Moderation Queue</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our compliance review flow monitors flagged queue assets, preventing counterfeiting, fraud, and ensuring marketplace integrity.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Luxury Newsletter CTA */}
      <section className="bg-blue-50/40 border border-blue-100 rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase text-[10px]">STAY INFORMED</span>
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Never Miss a Heritage Auction Reset</h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Subscribe to our premium digital alerts ledger. Access priority alerts on incoming classic watch caches, highkey tech releases and limited sports collectibles before the auction rooms unlock.
        </p>
        <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 pt-2">
          <input
            id="newsletter-email-input"
            type="email"
            placeholder="Enter your VIP email address"
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
          />
          <button
            id="newsletter-subscribe-btn"
            onClick={() => alert("Successfully enrolled in premium VIP collector notifications!")}
            className="bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm shadow-blue-500/10 animate-fade-in"
          >
            Join VIP List
          </button>
        </div>
      </section>

    </div>
  );
};
