import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
      <span className="sr-only">Loading content…</span>
      <div className="h-56 bg-gray-200 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-1 w-1/3">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-6 animate-pulse">
      <span className="sr-only">Loading dashboard…</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl p-6" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-white border border-gray-100 rounded-2xl" />
        <div className="h-96 bg-white border border-gray-100 rounded-2xl" />
      </div>
    </div>
  );
};  
