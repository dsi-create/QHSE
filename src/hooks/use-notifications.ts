import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { apiClient } from '@/integrations/api/client';
import { showError } from '@/utils/toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      // Vérifier si l'utilisateur est connecté avant de faire la requête
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        // Pas de token, pas de notifications
        setNotifications([]);
        return;
      }

      // Vérifier aussi que le token est défini dans le client API
      apiClient.setToken(token);

      try {
        const data = await apiClient.getNotifications();
        const fetchedNotifications: Notification[] = data.map((item: any) => ({
          id: item.id,
          recipient_id: item.recipient_id,
          message: item.message,
          read: item.read === 1 || item.read === true,
          created_at: new Date(item.created_at),
          link: item.link,
        }));
        setNotifications(fetchedNotifications);
      } catch (error: any) {
        // Ne pas afficher d'erreur si c'est juste une erreur d'authentification
        if (error.status !== 401 && error.status !== 403) {
          console.error("Error fetching notifications:", error.message);
        }
      }
    };

    fetchNotifications();
    // Polling toutes les 10 secondes pour les notifications
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = async (recipientId: string, message: string, link?: string) => {
    try {
      await apiClient.createNotification({ recipient_id: recipientId, message, link });
    } catch (error: any) {
      console.error("Error adding notification:", error.message);
      // Don't show error to user for notifications, just log
    }
  };

  const markNotificationsAsRead = async (userId: string) => {
    try {
      await apiClient.markNotificationsAsRead();
    } catch (error: any) {
      console.error("Error marking notifications as read:", error.message);
      showError("Erreur lors de la mise à jour des notifications.");
    }
  };

  return {
    notifications,
    setNotifications,
    addNotification,
    markNotificationsAsRead,
  };
};