import React from 'react';
import { DashboardStatData } from '../types/dashboard.types';
import { DashboardStatCard } from './DashboardStatCard';

interface DashboardStatsProps {
  stats: DashboardStatData[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <DashboardStatCard key={index} {...stat} />
      ))}
    </div>
  );
};
