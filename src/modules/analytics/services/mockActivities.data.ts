import type { RecentActivity } from '@/modules/analytics/types/activity.types';

export const mockActivities: RecentActivity[] = [
  {
    id: 'act1',
    type: 'bid_placed',
    title: 'Vintage Rolex Submariner',
    timeAgo: '2 hours ago',
    amount: 8450,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEi87bMnKhFHqJ3-zB0UuV6jek8iK5RePOJRXV62pmn0yIcl4v8EvDYcm-Ly55EYUuEciZN5oWWuibLFf4Sip57Ik2O_0b75GPA3RWubAg0gKLKgrgn2zTb8dlt_zamBRtVL2N9HW1AlE_8BEJw_IWbh_hbEwUmic1hFqKY3IXbqkjTDm7iz5bbUxyfDgqThvUCty4I2ey0N8HC-ijylmRVLpJGcJHnU7QISv1-lhrS4lBidJGqCXYBqgEpkJcLyZajyJ7svbRlwr2',
    statusText: 'Leading',
    statusType: 'leading'
  },
  {
    id: 'act2',
    type: 'ended_lost',
    title: 'Abstract "Ocean Dream" Canvas',
    timeAgo: '5 hours ago',
    amount: 1200,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChNuRQ4nBIoGC2AwfrfkDmflR3frXGQmR5s3ETL4KlGpLNU-R9DUn3pKw-xfhdQzhIwGrwXwLcQn8lVQB_9ybb2osS6MN7q3Haq8nDbBsEmvFai8o2XT4yzUNMzF9bJVyY_cnIMN2B0IjLhg70JpMC68ZBjhmefFtqxN2oNbaKhEu5i1y0klmTOLIng8p76v8v0huK5u7Ivi-mzg1WGWyUXTWrXbYhhi6rH1QodzArF51jFMAH06B0-xOBdLjcS_lum8vM-ZMBfyFo',
    statusText: 'Outbid',
    statusType: 'outbid'
  },
  {
    id: 'act3',
    type: 'payment_confirmed',
    title: 'MacBook Pro M2 Max',
    timeAgo: 'Yesterday',
    amount: 2800,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXz4MbjjUeOT7JpBEuR1oG9DttRletgopN7kCFaW1640eyWb2RaI0iLEl-O9dSq00FDzn4i-kNNKcyXsPMO6DlFOZFlp5fclPrnF48edO-3aq4qNImB-NE84M0I2PWLBrAR0vavuctGtObKBCG1w_pCNfPcDA0ukTalBJBU53vEU0XVLKGpArn-D5OsqtaxK0xue3z7NZCucyn1HNkLHp-pblDn8KqBjKU5yYPXyI_APlLdNPrPtqUQElP_wHe-COq5tDBHPiJJ2fF',
    statusText: 'Paid',
    statusType: 'paid'
  }
];
