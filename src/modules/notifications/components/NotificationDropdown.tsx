import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
  hasSystemNotice?: boolean;
  onSystemNoticeClick?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onToggle,
  onClear,
  hasSystemNotice,
  onSystemNoticeClick
}) => {
  return (
    <div className="relative">
      <button
        id="notifications-toggle-btn"
        onClick={onToggle}
        className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-950 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 rounded-xl transition-all"
      >
        <Bell size={20} />
        {hasSystemNotice ? (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        ) : notifications.length > 0 ? (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        ) : null}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Notifications ({notifications.length})
            </span>
            <button id="clear-noti-btn" onClick={onClear} className="text-[10px] text-blue-600 hover:underline">
              Clear all
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {hasSystemNotice && (
              <div
                onClick={onSystemNoticeClick}
                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-[11px] text-red-700 dark:text-red-200 leading-relaxed border border-red-200 dark:border-red-800/50 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
              >
                <strong className="block mb-1 text-red-800 dark:text-red-300">System Update Notice</strong>
                A new platform version is available. Click here to view the important notice in your profile.
              </div>
            )}
            {!hasSystemNotice && notifications.length === 0 ? (
              <p className="text-xs text-center text-slate-400 py-6">No new-notifications</p>
            ) : (
              notifications.map((notif, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-150 dark:border-slate-700/50"
                >
                  {notif}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
