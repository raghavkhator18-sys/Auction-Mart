export interface RecentActivity {
  id: string;
  type: 'bid_placed' | 'ended_won' | 'ended_lost' | 'payment_confirmed';
  title: string;
  timeAgo: string;
  amount: number;
  thumbnail: string;
  statusText: string;
  statusType: 'leading' | 'outbid' | 'paid' | 'won' | 'lost';
}
