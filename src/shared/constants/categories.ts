import { Award, Car, Coins, Laptop, Watch } from 'lucide-react';

export const BROWSE_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Coins },
  { id: 'Luxury Watches', name: 'Luxury Watches', icon: Watch },
  { id: 'Automotive', name: 'Automotive', icon: Car },
  { id: 'Collectibles', name: 'Collectibles', icon: Award },
  { id: 'Tech', name: 'Tech', icon: Laptop },
] as const;
