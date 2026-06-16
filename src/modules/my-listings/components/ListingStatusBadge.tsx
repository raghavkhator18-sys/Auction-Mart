import React from 'react';

interface ListingStatusBadgeProps {
  status: 'active' | 'draft' | 'flagged' | 'ended' | string;
  flagReason?: string;
}

export const ListingStatusBadge: React.FC<ListingStatusBadgeProps> = ({ status, flagReason }) => {
  const isActive = status === 'active';
  const isFlagged = status === 'flagged';
  const isDraft = status === 'draft';

  return (
    <>
      <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase font-bold px-2.5 py-1 rounded-full ${isActive
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : isFlagged
          ? 'bg-red-50 text-red-700 border border-red-200'
          : isDraft
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : isFlagged ? 'bg-red-500' : isDraft ? 'bg-amber-500' : 'bg-slate-400'
          }`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {isFlagged && flagReason && (
        <p className="text-[9px] text-red-600 mt-1 max-w-36 leading-tight">
          {flagReason}
        </p>
      )}
    </>
  );
};
