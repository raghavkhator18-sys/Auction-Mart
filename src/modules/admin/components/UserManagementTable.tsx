import React from 'react';
import { UserProfile } from '@/shared/types';

interface UserManagementTableProps {
  users: UserProfile[];
  onModifyUserStatus: (email: string, status: 'Verified' | 'Standard' | 'Flagged') => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onModifyUserStatus }) => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border-b border-slate-150 dark:border-slate-700/50 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">User Management</h3>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Showing {users.length.toLocaleString()} users</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-150 dark:border-slate-700/50">
              <th className="py-3 px-6">User</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Auctions</th>
              <th className="py-3 px-6 text-right">Adjustment Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50/20 text-xs text-slate-600 dark:text-slate-300">
                <td className="py-3 px-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-200">{user.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded font-bold ${
                    user.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : user.status === 'Flagged' ? 'bg-red-50 text-red-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>{user.status}</span>
                </td>
                <td className="py-3 px-4 font-bold text-slate-950">{user.auctionsCount} Active</td>
                <td className="py-3 px-6 text-right">
                  <select
                    id={`user-status-main-${user.email}`}
                    value={user.status}
                    onChange={(e) => onModifyUserStatus(user.email, e.target.value as any)}
                    className="text-[10.5px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded px-2 py-1 focus:outline-hidden cursor-pointer shadow-3xs"
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
  );
};
