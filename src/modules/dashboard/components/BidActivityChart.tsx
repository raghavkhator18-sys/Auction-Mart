import React from 'react';
import { ChartDataPoint } from '../types/dashboard.types';

interface BidActivityChartProps {
  data: ChartDataPoint[];
}

export const BidActivityChart: React.FC<BidActivityChartProps> = ({ data }) => {
  // Find max value for scaling the placeholder chart
  const maxBids = Math.max(...data.map(d => d.bids), 1);
  
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Bid Activity</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bids placed over the last 7 days</p>
        </div>
        <select className="text-sm bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>
      
      {/* Polished Custom CSS Chart Placeholder */}
      <div className="h-48 flex items-end justify-between gap-2 pt-4">
        {data.map((point, index) => {
          const heightPercent = `${(point.bids / maxBids) * 100}%`;
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex justify-center relative">
                {/* Tooltip */}
                <div className="absolute -top-10 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  {point.bids} bids
                </div>
                
                {/* Bar */}
                <div 
                  className="w-full max-w-[40px] bg-indigo-100 group-hover:bg-indigo-200 rounded-t-sm transition-colors relative overflow-hidden"
                  style={{ height: heightPercent, minHeight: '4px' }}
                >
                  <div className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-t-sm" style={{ height: 'max(4px, 10%)' }}></div>
                </div>
              </div>
              
              {/* X-axis label */}
              <span className="text-[10px] font-medium text-slate-400 mt-2">{point.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
