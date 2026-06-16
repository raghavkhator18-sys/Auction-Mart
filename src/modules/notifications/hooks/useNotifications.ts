import { useState } from 'react';

const INITIAL_NOTIFICATIONS: string[] = [];

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
