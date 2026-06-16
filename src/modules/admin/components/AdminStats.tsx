import React from 'react';
import { Users, TrendingUp, Gavel } from 'lucide-react';
import { AuctionItem, UserProfile } from '@/shared/types';

interface AdminStatsProps {
  auctions: AuctionItem[];
  users: UserProfile[];
}

export const AdminStats: React.FC<AdminStatsProps> = ({ auctions, users }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100"><Users size={20} /></div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Total Users</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{users.length.toLocaleString()}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Active registered accounts</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100"><span className="text-amber-600 font-black text-lg">₹</span></div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Total Revenue</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">₹{auctions.reduce((s, a) => s + a.currentBid, 0).toLocaleString()}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Sum of current offers</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 border border-rose-100"><Gavel size={20} /></div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Active Auctions</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{auctions.filter(a => a.status === 'active').length}</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Currently live listings</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100"><TrendingUp size={20} /></div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Success Rate</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{Math.round((auctions.filter(a=>a.status==='active').length / Math.max(1, auctions.length)) * 100)}%</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Live vs total listings</p>
        </div>
      </div>
    </div>
  );
};
