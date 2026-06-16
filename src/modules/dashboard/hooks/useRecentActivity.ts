import { useMemo } from 'react';
import { RecentActivity } from '@/shared/types';
import { DASHBOARD_CONSTANTS } from '../constants/dashboardConstants';

export const useRecentActivity = (activities: RecentActivity[] = []) => {
  return useMemo(() => {
    // We can add filtering or sorting logic here in the future
    return {
      recentActivities: activities.slice(0, DASHBOARD_CONSTANTS.RECENT_ACTIVITY_LIMIT),
      allActivities: activities,
    };
  }, [activities]);
};
