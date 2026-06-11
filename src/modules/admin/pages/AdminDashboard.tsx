import React from 'react';
import { ShieldCheck, ShieldAlert, Users, TrendingUp, Gavel } from 'lucide-react';
import { AuctionItem, UserProfile } from '@/shared/types';

interface AdminDashboardProps {
  auctions: AuctionItem[];
  users: UserProfile[];
  onClearFlag: (id: string) => void;
  onModifyUserStatus: (email: string, status: 'Verified' | 'Standard' | 'Flagged') => void;
  currentRole: 'admin';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  auctions,
  users,
  onClearFlag,
  onModifyUserStatus,
  currentRole
}) => {
  const flaggedLots = auctions.filter((item) => item.status === 'flagged');

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
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

      {/* Overview summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100"><Users size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Total Users</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{users.length.toLocaleString()}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Active registered accounts</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100"><span className="text-amber-600 font-black text-lg">₹</span></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Total Revenue</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">₹{auctions.reduce((s, a) => s + a.currentBid, 0).toLocaleString()}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Sum of current offers</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 border border-rose-100"><Gavel size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Active Auctions</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{auctions.filter(a => a.status === 'active').length}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Currently live listings</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100"><TrendingUp size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Success Rate</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{Math.round((auctions.filter(a=>a.status==='active').length / Math.max(1, auctions.length)) * 100)}%</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Live vs total listings</p>
          </div>
        </div>
      </div>

      {/* Main two-column area: flagged listings + user management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flagged Listings */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Flagged Listings</h3>
            <a className="text-xs text-blue-600">View All</a>
          </div>

          {flaggedLots.slice(0,3).map(item => (
            <div key={item.id} className="bg-white border border-slate-200 p-3 rounded-xl flex items-start gap-3">
              <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-md object-cover border" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-[12px] text-slate-500">{item.flagReason || 'Suspected issue'}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => onClearFlag(item.id)} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded">Clear</button>
                  <button onClick={() => alert('Remove action')} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User management table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase">User Management</h3>
            <div className="text-[10px] text-slate-500">Showing {users.length.toLocaleString()} users</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-150">
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Auctions</th>
                  <th className="py-3 px-6 text-right">Adjustment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50/20 text-xs text-slate-600">
                    <td className="py-3 px-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700">{user.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded font-bold ${
                        user.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : user.status === 'Flagged' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>{user.status}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-950">{user.auctionsCount} Active</td>
                    <td className="py-3 px-6 text-right">
                      <select
                        id={`user-status-main-${user.email}`}
                        value={user.status}
                        onChange={(e) => onModifyUserStatus(user.email, e.target.value as any)}
                        className="text-[10.5px] font-semibold bg-white border border-slate-200 text-slate-700 rounded px-2 py-1 focus:outline-hidden cursor-pointer shadow-3xs"
                      >
                        <option value="Verified">Verified Pro</option>
                        <option value="Standard">Standard</option>
                        <option value="Flagged">Flagged Account</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom small panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h4 className="text-sm font-bold">Platform Health Report</h4>
          <p className="text-xs text-slate-500 mt-2">Real-time system diagnostics across global server nodes. No critical issues reported in the last 24 hours.</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 bg-emerald-100 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-emerald-600 w-[80%]" />
            </div>
            <div className="text-xs text-slate-400 font-semibold">Stable</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold">Active Bidding War</h4>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Item #{auctions[0]?.id || 'N/A'} - {auctions[0]?.title || 'No active war'}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 bg-blue-100 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-blue-600 w-[40%]" />
            </div>
            <div className="text-xs text-slate-500">+14 users bidding currently</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;