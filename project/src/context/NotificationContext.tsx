import React, { createContext, useState, useContext, useEffect } from 'react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Types
interface Notification {
  id: string;
  type: 'event_reminder' | 'admin_alert' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  eventId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Calculate unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 11),
      read: false,
      createdAt: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast(notification.title, {
      icon: notification.type === 'event_reminder' ? '🔔' : 
            notification.type === 'admin_alert' ? '👤' : 'ℹ️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Simulate event reminders (for demo purposes)
  useEffect(() => {
    if (!user) return;

    // Mock events data for notifications
    const mockEvents = [
      { id: '1', title: 'Tech Workshop', date: addDays(new Date(), 1) },
      { id: '2', title: 'Career Fair', date: addDays(new Date(), 3) },
      { id: '3', title: 'Programming Contest', date: addDays(new Date(), 5) },
    ];

    // Add initial welcome notification
    if (user.role === 'student') {
      setTimeout(() => {
        addNotification({
          type: 'system',
          title: 'Welcome to LoggedIn!',
          message: 'Discover and join events, get reminders, and more.',
        });
      }, 2000);

      // Set up event reminders
      const reminderInterval = setInterval(() => {
        mockEvents.forEach(event => {
          const today = new Date();
          const eventDate = new Date(event.date);
          const daysUntilEvent = Math.ceil(
            (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Remind about events happening soon
          if (daysUntilEvent <= 5 && daysUntilEvent > 0) {
            const timeDescription = isTomorrow(eventDate)
              ? 'tomorrow'
              : isToday(eventDate)
              ? 'today'
              : `in ${daysUntilEvent} days`;
              
            addNotification({
              type: 'event_reminder',
              title: `Event Reminder: ${event.title}`,
              message: `Don't forget! ${event.title} is happening ${timeDescription} on ${format(eventDate, 'MMMM d, yyyy')}`,
              eventId: event.id,
            });
          }
        });
      }, 60000 * 60); // Check every hour (in ms) - for demo purposes

      return () => clearInterval(reminderInterval);
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};