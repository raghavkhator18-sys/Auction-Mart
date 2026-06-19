import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuctionMart } from '@/app/store';
import { DashboardOverviewProps } from '../types/dashboard.types';

// Custom Hooks
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useRecentActivity } from '../hooks/useRecentActivity';
import { useDashboardAnalytics } from '../hooks/useDashboardAnalytics';

// Components
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardStats } from '../components/DashboardStats';
import { RecentBidActivity } from '../components/RecentBidActivity';
import { RecommendedAuctions } from '../components/RecommendedAuctions';
import { ActiveWinningAuctions } from '../components/ActiveWinningAuctions';
import { BidActivityChart } from '../components/BidActivityChart';
import { DashboardEmptyState } from '../components/DashboardEmptyState';

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  activities,
  auctions,
  setCurrentScreen,
  setSelectedProduct,
  setSearchQuery
}) => {
  const { currentUser } = useAuctionMart();

  // Call Hooks
  const { stats, myAuctionsBidOn, totalMyBidsCount } = useDashboardStats(auctions);
  const { recentActivities } = useRecentActivity(activities);
  const { chartData } = useDashboardAnalytics();

  const navigate = useNavigate();

  // Callbacks
  const handleRecommendClick = (item: any) => {
    navigate(`/product/${item.id}`);
  };

  const hasActivity = totalMyBidsCount > 0 || recentActivities.length > 0;

  return (
    <div className="space-y-6 pb-16">
      <DashboardHeader currentUser={currentUser} />

      {!hasActivity ? (
        <DashboardEmptyState setCurrentScreen={setCurrentScreen} />
      ) : (
        <>
          <DashboardStats stats={stats} />

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Charts, Active Bids, Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              <BidActivityChart data={chartData} />
              
              <ActiveWinningAuctions 
                myAuctionsBidOn={myAuctionsBidOn} 
                setCurrentScreen={setCurrentScreen}
                handleRecommendClick={handleRecommendClick}
              />
              
              <RecentBidActivity activities={recentActivities} />
            </div>

            {/* Right Column: Watchlist, Recommended, Events */}
            <div className="space-y-6">
              <RecommendedAuctions 
                auctions={auctions} 
                handleRecommendClick={handleRecommendClick}
                setCurrentScreen={setCurrentScreen}
                setSearchQuery={setSearchQuery}
              />
            </div>
            
          </div>
        </>
      )}
    </div>
  );
};
