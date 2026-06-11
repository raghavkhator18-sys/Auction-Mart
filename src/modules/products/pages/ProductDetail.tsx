import React, { useState } from 'react';
import { useAuctionTimer } from '@/shared/hooks/useAuctionTimer';
import { ArrowLeft, Clock, ShieldCheck, Heart, Share2, Award, Star, Gavel, CheckCircle2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { useAuctionMart } from '@/app/store';

interface ProductDetailProps {
  item: AuctionItem;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onPlaceBid: (itemId: string, bidAmount: number, maxBid?: number) => void;
  setCurrentScreen: (screen: ScreenId) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  item,
  favorites,
  toggleFavorite,
  onPlaceBid,
  setCurrentScreen
}) => {
  const { currentUser } = useAuctionMart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [bidValue, setBidValue] = useState<string>('');
  const [proxyMaxBid, setProxyMaxBid] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'history'>('details');
  const [isFollowed, setIsFollowed] = useState(false);
  const { formatTimer } = useAuctionTimer('Auction Closed');

  // Fallback highkey gallery images for luxury feel (Rolex details)
  const galleryImages = [
    item.imageUrl,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAVm62PPCEnPFUrLYOi6Y3yWhhWU-Eii02QI6Fz6wsPfjtot278GJW3wB6vyEBGhsH2yvHZk1AGvgL4xz9qcm1IVTM-62K6gHRdPN0SmjyOYJYOFE_CWHfbhQ51--yM8nNL37CtLcb819XMpi1R6YzO5O1L_M9wV6gTcRM2lCH2cmTAu4TDEBn1CgtMfevrbyw7bfGhfkSPbkpcV3Jn8lgK5S-b6sDZMV4ANvAWXNFLSCcjJAj4JxSe34cpj7mrujr2q49CMiA8o_Xx',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDIplzXV5kd-sAJbHhtsprbV__Vj7dW-bHYUy4BBgk5N41Ts8Y1P__Ad_3Y1WMwE3MsNLAVT6VohTFwuTmSILM9zMLwT_7MHr9EJJ2toFvOoespHseoICYtUdQALhV03tA9EtHShtK3RiR6LRulPuPJqNe5gqJZpLlP7uMLKrfMUp-1esedgLeSidiwDRchbwJ0J7vNc8F8tR4b1yYyVKO6FjzR2FkD61wIc9M1bwO49UGAuz7uQOYfghlr4htt5Ae4hy96bbVwDwcu',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-bn8UQgUH2GOYLkafW-qaQsqdDIx_Y4O_13KRHsIHZCWLxDsf61o1OiNPBICpE3BhwznO3wzp3pgun2i4nsRReNvnGiB8VKEiOvByGVGXD6LTwE0a3mUbyU8YKw_SezEThUCEDPNSPYcZgPNG5gl20vcuJsFcm4YSdFz1OJ6QrN-7afvsDIcwuJgwQFZJME-5Tdayp-DeHyZpv_svWkId73X8CdOpQ4hYr6xdU_32U3_7l4z_rTvMG2TwLVBqex4KpF6p_e91s5z'
  ];

  const handleQuickAdd = (amount: number) => {
    const current = parseFloat(bidValue) || item.currentBid;
    setBidValue((current + amount).toString());
  };

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidValue) return;

    const bidNum = parseFloat(bidValue);
    if (bidNum <= item.currentBid) {
      alert(`Stake must beat the current premium bid of ₹${item.currentBid.toLocaleString()}`);
      return;
    }

    const maxBidNum = proxyMaxBid ? parseFloat(proxyMaxBid) : undefined;
    onPlaceBid(item.id, bidNum, maxBidNum);

    // Clear inputs after bid completion animation
    setBidValue('');
    setProxyMaxBid('');
    alert(`Congratulations! You are now leading lot bids with an offer of ₹${bidNum.toLocaleString()}`);
  };

  const isFav = favorites.includes(item.id);

  return (
    <div className="space-y-6 pb-16">

      {/* 1. Back Arrow navigation bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
        <button
          id="detail-back-to-browse-btn"
          onClick={() => setCurrentScreen('browse')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="text-blue-600" /> Back to Browse Catalogue
        </button>

        <div className="flex items-center gap-2">
          <button id="share-btn" className="p-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer" title="Copy lot share link" onClick={() => alert("Copied secure bid-room share link!")}>
            <Share2 size={16} />
          </button>
          <button id="favorite-btn" className="p-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer" title="Save lot" onClick={() => toggleFavorite(item.id)}>
            <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
          </button>
        </div>
      </div>

      {/* 2. Primary layout: Image Slider (Left) + High Bidding controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left Aspect: Image Showcase Slider */}
        <div className="space-y-4">
          <div className="relative h-[480px] bg-white border border-slate-200 rounded-2xl overflow-hidden group shadow-sm">
            <img
              src={galleryImages[activeImageIdx]}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Rare high wealth Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] uppercase font-mono tracking-widest font-extrabold shadow-sm">
              <Award size={13} /> Rare Timepiece Sealed Box
            </div>

            {/* Slider navigators */}
            <button
              id="slider-prev-btn"
              onClick={() => setActiveImageIdx((activeImageIdx - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-xs rounded-full border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-white transition-opacity shadow-sm cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              id="slider-next-btn"
              onClick={() => setActiveImageIdx((activeImageIdx + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-xs rounded-full border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-white transition-opacity shadow-sm cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Sub Row thumbnail buttons */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                id={`thumb-btn-${idx}`}
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative h-20 bg-white border rounded-xl overflow-hidden transition-all cursor-pointer ${activeImageIdx === idx
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-slate-200 hover:border-slate-300'
                  }`}
              >
                <img src={img} alt="Detail view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Aspect: High bidding transaction board */}
        <div className="space-y-6">

          {/* Header Title & Sku */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">{item.sku}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-blue-600 font-extrabold tracking-wide uppercase">{item.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-normal">{item.title}</h1>
            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
          </div>

          {/* Live countdown badge block */}
          <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 grid grid-cols-2 gap-4 divide-x divide-blue-200/50">
            <div>
              <span className="text-[9px] text-blue-800 font-bold uppercase tracking-wider block">AUCTION STATUS</span>
              <span className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5 mt-1">
                <Clock size={16} className="text-blue-600 animate-pulse" /> Live Room
              </span>
            </div>
            <div className="pl-5">
              <span className="text-[9px] text-blue-800 font-bold uppercase tracking-wider block">CLOSING TIMER</span>
              <span className="text-lg font-mono font-black text-blue-600 tracking-tight mt-1 inline-block">
                {formatTimer(item.timerSeconds)}
              </span>
            </div>
          </div>

          {/* Price telemetry and Bids statistics */}
          <div className="p-5 border border-slate-200 rounded-2xl bg-white flex items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] text-slate-450 font-semibold block uppercase">CURRENT HIGHEST BID</span>
              <span className="text-3xl font-black text-blue-600">₹{item.currentBid.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-455 text-slate-400 font-semibold block uppercase">LEDGER TRAFFIC</span>
              <span className="text-lg font-extrabold text-slate-900">{item.totalBids} bids recorded</span>
            </div>
          </div>

          {/* Interactive Bid Form */}
          <form onSubmit={handlePlaceBidSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

            <div className="space-y-1.5">
              <label htmlFor="detail-bid-input" className="block text-[10px] uppercase font-bold text-slate-800 font-semibold">Your Ledger Offer (INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-sm font-bold text-slate-400">₹</span>
                <input
                  id="detail-bid-input"
                  type="number"
                  min={item.currentBid + 1}
                  required
                  placeholder={`Min ₹${(item.currentBid + 1).toLocaleString()}`}
                  value={bidValue}
                  onChange={(e) => setBidValue(e.target.value)}
                  className="w-full text-sm font-bold pl-8 pr-16 py-3 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50"
                />
                <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-slate-400 uppercase">INR</span>
              </div>
            </div>

            {/* Quick Increment Add shortcuts */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-450 uppercase">Quick Add increments</span>
              <div className="grid grid-cols-3 gap-2">
                {[50, 200, 1000].map((num) => (
                  <button
                    id={`inc-btn-${num}`}
                    key={num}
                    type="button"
                    onClick={() => handleQuickAdd(num)}
                    className="py-1.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer"
                  >
                    +₹{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Proxy Auto Bidding capability inputs */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor="detail-proxy-input" className="block text-[10px] uppercase font-bold text-slate-800 font-semibold">backup bid amount</label>
              <input
                id="detail-proxy-input"
                type="number"
                placeholder="system auto raises the bid if got outbid"
                value={proxyMaxBid}
                onChange={(e) => setProxyMaxBid(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              id="detail-submit-bid"
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Place Bid
            </button>
          </form>

          {/* Seller information card matching mockup */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={item.sellerAvatar}
                alt={item.sellerName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-slate-900">{item.sellerName}</span>
                  <CheckCircle2 size={13} className="text-emerald-500 fill-emerald-100" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5">
                    <Star size={11} className="fill-blue-500 text-blue-600" /> {item.sellerRating} / 5.0
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-slate-500">{item.sellerSales} transactions</span>
                </div>
              </div>
            </div>

            <button
              id="follow-seller-btn"
              onClick={() => setIsFollowed(!isFollowed)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isFollowed
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-slate-50 border border-slate-250 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
            >
              {isFollowed ? 'Following ✓' : 'Follow Seller'}
            </button>
          </div>

        </div>

      </div>

      {/* 3. Specifications and information Tabs details switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

        {/* Tab triggers */}
        <div className="flex border-b border-slate-200">
          {[
            { id: 'details', name: 'Custody details' },
            { id: 'specs', name: 'Technical specifications' },
            { id: 'history', name: 'Ledger Audit History' }
          ].map((tab) => (
            <button
              id={`tab-trigger-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-all cursor-pointer ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-800'
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab workspace content */}
        {activeTab === 'details' && (
          <div className="space-y-3 pt-2 text-xs text-slate-650 leading-relaxed text-left text-slate-600">
            <p>
              This exquisite masterpiece is audited under direct escrow protocol. Every single millimeter and component has undergone multi-phase optical micro-verification to ensure its full conformity to serial blueprints.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs mt-2 font-medium">
              <ShieldCheck size={16} />
              <span>KYC verified custodial logistics. Fully matching box & registration certificate.</span>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="divide-y divide-slate-100 pt-2 text-xs text-slate-700">
            <div className="grid grid-cols-2 py-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wide">Model reference Sku</span>
              <span className="text-right font-mono font-bold text-slate-900">{item.sku}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wide">Condition rating</span>
              <span className="text-right font-black text-slate-900">{item.condition}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wide">Casing materials</span>
              <span className="text-right font-bold text-slate-900">Sandblasted industrial titanium & carbon fiber details</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wide">Water resistance rating</span>
              <span className="text-right font-bold text-slate-900">200 meters / 650 feet certified</span>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3.5 pt-2 text-xs text-slate-600">
            <div className="p-3 border border-slate-150 border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-slate-900 text-[11px]">
                <span>{currentUser?.name || 'User'} (Highest Bidder)</span>
                <span>₹{item.currentBid.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-400">Cryptographically verified on ledger • 10 seconds ago</p>
            </div>

            <div className="p-3 border border-slate-150 border-slate-200 rounded-xl space-y-1 opacity-82">
              <div className="flex justify-between font-bold text-slate-900 text-[11px]">
                <span>Michael Kross</span>
                <span>₹{(item.currentBid - Math.floor(item.currentBid * 0.05)).toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-400">Ledger audit trace • 3 minutes ago</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
