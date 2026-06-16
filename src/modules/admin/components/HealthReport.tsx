import React from 'react';
import { AuctionItem } from '@/shared/types';

interface HealthReportProps {
  auctions: AuctionItem[];
}

export const HealthReport: React.FC<HealthReportProps> = ({ auctions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
        <h4 className="text-sm font-bold">Platform Health Report</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Real-time system diagnostics across global server nodes. No critical issues reported in the last 24 hours.</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="h-2 bg-emerald-100 rounded-full flex-1 overflow-hidden">
            <div className="h-full bg-emerald-600 w-[80%]" />
          </div>
          <div className="text-xs text-slate-400 font-semibold">Stable</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold">Active Bidding War</h4>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Item #{auctions[0]?.id || 'N/A'} - {auctions[0]?.title || 'No active war'}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 bg-blue-100 rounded-full flex-1 overflow-hidden">
            <div className="h-full bg-blue-600 w-[40%]" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">+14 users bidding currently</div>
        </div>
      </div>
    </div>
  );
};
