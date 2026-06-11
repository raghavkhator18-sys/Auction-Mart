import React from 'react';
import { useAuctionTimer } from '@/shared/hooks/useAuctionTimer';
import { Landmark, TrendingUp, Gavel, Award, Hourglass, ArrowUpRight, ShieldCheck, CornerRightUp } from 'lucide-react';
import { AuctionItem, RecentActivity, ScreenId } from '@/shared/types';
import { useAuctionMart } from '@/app/store';

interface DashboardOverviewProps {
  activities: RecentActivity[];
  auctions: AuctionItem[];
  setCurrentScreen: (screen: ScreenId) => void;
  setSelectedProduct: (item: AuctionItem) => void;
  setSearchQuery?: (query: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  activities,
  auctions,
  setCurrentScreen,
  setSelectedProduct,
  setSearchQuery
}) => {
  const { currentUser } = useAuctionMart();
  const { formatTimer } = useAuctionTimer('Closed');

  // Compute stat bounds dynamically
  const myAuctionsBidOn = auctions.filter((item) => item.yourBid !== undefined);
  const totalMyBidsCount = myAuctionsBidOn.length;
  const currentWinningCount = myAuctionsBidOn.filter((item) => item.bidStatus === 'winning').length;
  const highestMyBidAmount = myAuctionsBidOn.reduce((max, item) => Math.max(max, item.yourBid || 0), 0);
  const spentEst = 34250 + 41200; // Mock total spent value for simulation parity

  const handleRecommendClick = (item: AuctionItem) => {
    setSelectedProduct(item);
    setCurrentScreen('product-detail');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark size={22} className="text-blue-600" /> {currentUser?.name || 'User'}'s Collector Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry and ledger of your historical high-value bidded properties.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-850 border border-emerald-100 px-3 py-1.5 rounded-xl">
          <ShieldCheck size={14} className="text-emerald-650" />
          <span className="font-semibold">Identity KYC Status: VERIFIED PRO</span>
        </div>
      </div>

      {/* 2. Bento Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bids */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
            <Gavel size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Total Bids Placed</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{totalMyBidsCount + 2}</p>
            <p className="text-[9px] text-slate-400 mt-0.5"> Across 2 categories</p>
          </div>
        </div>

        {/* Leading Bids */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-650 text-emerald-650 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Winning/Leading</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{currentWinningCount + 1}</p>
            <p className="text-[9px] text-emerald-600 font-medium mt-0.5">● No actions required</p>
          </div>
        </div>

        {/* Capital Committed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Maximum Committed</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">₹{spentEst.toLocaleString()}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Secure Escrow Shield</p>
          </div>
        </div>

        {/* Win Ratio */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
            <Hourglass size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Success Ratio</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">84.2%</p>
            <p className="text-[9px] text-emerald-650 font-medium mt-0.5">Top-tier status</p>
          </div>
        </div>

      </div>

      {/* 3. Main Dashboard Double Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Recent Activities & Active bidding list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Bid History Ledger */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-150">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-semibold">Recent Bid Activity Ledger</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Updates dynamically</span>
            </div>

            <div className="divide-y divide-slate-100">
              {activities.map((activity) => {
                const isLeading = activity.statusType === 'leading';
                const isWon = activity.statusType === 'won' || activity.statusType === 'paid';
                return (
                  <div key={activity.id} className="py-3 flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3">
                      <img
                        src={activity.thumbnail}
                        alt={activity.title}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-150"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-905 text-slate-900 group-hover:underline cursor-pointer">{activity.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{activity.timeAgo} • ID {activity.id.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs font-black text-slate-900">₹{activity.amount.toLocaleString()}</p>
                      <div className="mt-1 flex justify-end">
                        <span className={`inline-flex items-center gap-1 font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isLeading 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : isWon
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {activity.statusText}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active items with bidding lists */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm font-sans">
            <div className="flex justify-between items-center pb-2 border-b border-slate-150">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-semibold">Your Active Winning properties</span>
              <button id="view-all-bids-dash" onClick={() => setCurrentScreen('bids')} className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">View my bids page</button>
            </div>

            <div className="space-y-3">
              {myAuctionsBidOn.map((item) => {
                const remaining = formatTimer(item.timerSeconds);
                const isWinning = item.bidStatus === 'winning';
                return (
                  <div key={item.id} className="p-3.5 border border-slate-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-355 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-slate-150" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-[9px] text-slate-400 font-mono block uppercase font-semibold">{item.sku}</span>
                        <h4 onClick={() => handleRecommendClick(item)} className="text-xs font-black text-slate-900 hover:text-blue-600 cursor-pointer">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isWinning ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-rose-50 text-rose-700 font-semibold'
                          }`}>
                            {isWinning ? 'Winning' : 'Outbid'}
                          </span>
                          <span className="text-[10px] text-slate-500">Auto proxy: <strong className="text-slate-800">₹{(item.yourMaxBid || 0).toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between w-full md:w-auto items-center md:items-end gap-2.5">
                      <div className="text-left md:text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-semibold">CURRENT BID</span>
                        <span className="text-xs font-black text-slate-900">₹{item.currentBid.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-semibold">CLOSES IN</span>
                        <span className="text-xs font-mono font-bold text-blue-600">{remaining}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Premium Vault Recommendations & VIP Banner */}
        <div className="space-y-6">
          
          {/* VIP Concierge Banner */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent)] pointer-events-none" />
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1 font-semibold">
              <Award size={13} strokeWidth={2.5} /> PRO Membership
            </h4>
            <p className="text-xs font-black mt-2 leading-tight text-white">VIP Concierge Escrow System Active</p>
            <p className="text-[10px] text-slate-350 mt-2 leading-relaxed">
              You are globally verified. Your bids are routed on a dedicated priority fiber line, giving you maximum microsecond edge during countdown resets.
            </p>
          </div>

          {/* Premium Vault Recommendations List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="pb-2 border-b border-slate-150">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-semibold">Recommended Vault Lots</span>
              <p className="text-[10px] text-slate-400">Picked for your premium taste</p>
            </div>

            <div className="space-y-3">
              {auctions.slice(4, 7).map((rec) => (
                <div key={rec.id} className="flex gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <img
                    src={rec.imageUrl}
                    alt={rec.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 grow-0 shrink-0 bg-slate-50 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{rec.category}</p>
                    <h5
                      onClick={() => handleRecommendClick(rec)}
                      className="text-xs font-extrabold text-slate-950 hover:text-blue-600 truncate cursor-pointer"
                    >
                      {rec.title}
                    </h5>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-950 font-bold">₹{rec.currentBid.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 font-mono leading-none">{rec.totalBids} bids</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
               id="dash-browse-all-btn"
               onClick={() => {
                 if (setSearchQuery) setSearchQuery('');
                 setCurrentScreen('browse');
               }}
               className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 rounded-xl transition-colors text-center border border-slate-200 cursor-pointer"
            >
              Browse entire premium vault
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
