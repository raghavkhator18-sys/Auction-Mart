import React from 'react';
import { Archive } from 'lucide-react';

export const BidsHistory: React.FC = () => {
  // No hardcoded demo data — this section will show real ended bids
  // For now, show an empty state
  return (
    <>
      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-widest pt-4">Ended / Won Lots Archive</h2>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex items-center gap-3 shadow-sm text-left">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-slate-400 rounded-full flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
          <Archive size={20} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400">No ended auctions yet</h4>
          <p className="text-[10px] text-slate-400 font-sans mt-0.5">Won auctions will appear here once an auction you've bid on ends.</p>
        </div>
      </div>
    </>
  );
};
