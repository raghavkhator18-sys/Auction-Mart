import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  currentRole: 'admin';
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ currentRole }) => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 relative overflow-hidden shadow-sm">
      <div className="absolute right-0 top-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent)]" />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block font-semibold">SECURED COMPLIANCE TERMINAL</span>
          <h1 className="text-xl sm:text-2xl font-black">AuctionMart General Administration</h1>
          <p className="text-xs text-slate-300">Verify platform health index, manage flagged replica queues and adjust user verification statuses.</p>
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl shadow-xs">
          <ShieldCheck size={14} />
          <span>ROLE ACTIVE: {currentRole.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
