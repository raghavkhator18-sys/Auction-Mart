import { useMemo } from 'react';
import { ChartDataPoint } from '../types/dashboard.types';

export const useDashboardAnalytics = () => {
  return useMemo(() => {
    // Generate mock data for the last 7 days for the chart
    const data: ChartDataPoint[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        bids: Math.floor(Math.random() * 20) + 5,
        won: Math.floor(Math.random() * 3),
        spent: Math.floor(Math.random() * 5000) + 1000,
      });
    }

    return { chartData: data };
  }, []);
};
