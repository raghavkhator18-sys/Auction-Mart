import React from 'react';
import { Gavel, FileText, ShoppingBag, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';

interface StatsCardsProps {
  activeCount: number;
  draftCount: number;
  soldCount: number;
  totalRevenue: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ activeCount, draftCount, soldCount, totalRevenue }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Gavel size={20} />}
        value={String(activeCount)}
        label="Active Listings"
        subLabel="Currently live auctions"
        color="text-emerald-600"
        bg="bg-emerald-50"
      />
      <StatCard
        icon={<FileText size={20} />}
        value={String(draftCount)}
        label="Draft Listings"
        subLabel="Saved, not yet published"
        color="text-amber-600"
        bg="bg-amber-50"
      />
      <StatCard
        icon={<ShoppingBag size={20} />}
        value={String(soldCount)}
        label="Sold Items"
        subLabel="Completed auctions"
        color="text-blue-600"
        bg="bg-blue-50"
      />
      <StatCard
        icon={<TrendingUp size={20} />}
        value={totalRevenue > 0 ? `₹${totalRevenue.toLocaleString()}` : '₹0'}
        label="Total Revenue"
        subLabel="From completed sales"
        color="text-purple-600"
        bg="bg-purple-50"
      />
    </div>
  );
};
