import { useState, useEffect } from 'react';
import { useAuctionMart } from '@/app/store/AuctionMartContext';
import api from '@/lib/axios';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { currentUser } = useAuctionMart();

  useEffect(() => {
    if (currentUser?.email) {
      api.get(`/notification/${encodeURIComponent(currentUser.email)}`)
        .then(res => {
          if (res.data) {
            setNotifications(res.data.map((n: any) => n.message));
          }
        })
        .catch(err => console.error("Failed to fetch notifications:", err));
    } else {
      setNotifications([]);
    }
  }, [currentUser?.email]);

  const clearNotifications = () => {
    setNotifications([]);
    if (currentUser?.email) {
      api.delete(`/notification/${encodeURIComponent(currentUser.email)}`)
        .catch(err => console.error("Failed to clear notifications:", err));
    }
  };

  return {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    clearNotifications
  };
};
