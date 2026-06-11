import { useState } from 'react';

const INITIAL_NOTIFICATIONS = [
  'Your bid on Rolex Cosmograph Daytona has been placed successfully!',
  'New bid placed on Vintage Leica m3 ($3,200)',
  'Alert: Security team flagged suspicious smartwatch'
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<string[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const clearNotifications = () => setNotifications([]);

  return {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    clearNotifications
  };
};
