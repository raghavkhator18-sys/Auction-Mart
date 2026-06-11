export type UserRole = 'client' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  auctionsCount: number;
  status: 'Verified' | 'Standard' | 'Flagged';
}
