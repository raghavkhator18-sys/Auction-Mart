import React from 'react';
import { AuctionItem, UserProfile } from '@/shared/types';
import { AdminHeader } from '../components/AdminHeader';
import { AdminStats } from '../components/AdminStats';
import { FlaggedListings } from '../components/FlaggedListings';
import { UserManagementTable } from '../components/UserManagementTable';
import { HealthReport } from '../components/HealthReport';

interface AdminDashboardProps {
  auctions: AuctionItem[];
  users: UserProfile[];
  onClearFlag: (id: string) => void;
  onModifyUserStatus: (email: string, status: 'Verified' | 'Standard' | 'Flagged') => void;
  currentRole: 'admin';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  auctions,
  users,
  onClearFlag,
  onModifyUserStatus,
  currentRole
}) => {
  const flaggedLots = auctions.filter((item) => item.status === 'flagged');

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <AdminHeader currentRole={currentRole} />

      {/* Overview summary cards */}
      <AdminStats auctions={auctions} users={users} />

      {/* Main two-column area: flagged listings + user management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flagged Listings */}
        <FlaggedListings flaggedLots={flaggedLots} onClearFlag={onClearFlag} />

        {/* User management table */}
        <UserManagementTable users={users} onModifyUserStatus={onModifyUserStatus} />
      </div>

      {/* Bottom small panels */}
      <HealthReport auctions={auctions} />
    </div>
  );
};

export default AdminDashboard;