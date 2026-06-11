export interface AuctionItem {
  id: string;
  title: string;
  category: string;
  description: string;
  sku?: string;
  currentBid: number;
  yourBid?: number;
  yourMaxBid?: number;
  totalBids: number;
  imageUrl: string;
  timerSeconds: number;
  timerText?: string;
  status: 'active' | 'ended' | 'draft' | 'flagged';
  flagReason?: string;
  bidStatus?: 'winning' | 'outbid' | 'none';
  condition: 'New' | 'Used';
  sellerName: string;
  sellerRating: number;
  sellerSales: number;
  sellerAvatar: string;
}
