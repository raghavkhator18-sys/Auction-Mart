import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onToggle,
  onClear
}) => {
  return (
    <div className="relative">
      <button
        id="notifications-toggle-btn"
        onClick={onToggle}
        className="relative p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-all"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-900">
              Notifications ({notifications.length})
            </span>
            <button id="clear-noti-btn" onClick={onClear} className="text-[10px] text-blue-600 hover:underline">
              Clear all
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-center text-slate-400 py-6">No new-notifications</p>
            ) : (
              notifications.map((notif, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-700 leading-relaxed border border-slate-150"
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
