import { AuctionItem, RecentActivity, ScreenId } from '@/shared/types';

export interface DashboardOverviewProps {
  activities: RecentActivity[];
  auctions: AuctionItem[];
  setCurrentScreen: (screen: ScreenId) => void;
  setSelectedProduct: (item: AuctionItem) => void;
  setSearchQuery?: (query: string) => void;
}

export interface DashboardStatData {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  iconName?: 'Gavel' | 'Trophy' | 'Wallet' | 'Heart'; // or pass the lucide icon component directly
}

export interface ChartDataPoint {
  date: string;
  bids: number;
  won: number;
  spent: number;
}
