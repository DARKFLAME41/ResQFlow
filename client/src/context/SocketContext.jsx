import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    const socketInstance = io('/', {
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      if (user?.role) {
        socketInstance.emit('join_role', user.role);
      }
    });

    socketInstance.on('incident_created', (incident) => {
      setLastEvent({ type: 'INCIDENT_CREATED', payload: incident, timestamp: Date.now() });
      addToastNotification(`🚨 New Emergency: ${incident.type} (${incident.incidentId})`, incident.severity);
    });

    socketInstance.on('incident_updated', (data) => {
      setLastEvent({ type: 'INCIDENT_UPDATED', payload: data, timestamp: Date.now() });
      addToastNotification(`Update on ${data.incident.incidentId}: ${data.incident.status}`, 'info');
    });

    socketInstance.on('notification_broadcast', ({ userId, notification }) => {
      if (!user || user.id === userId) {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.role, user?.id]);

  const addToastNotification = (text, type = 'info') => {
    const newNotif = {
      id: `toast-${Date.now()}`,
      message: text,
      type,
      createdAt: new Date().toLocaleTimeString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const clearUnread = () => {
    setUnreadCount(0);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      notifications,
      unreadCount,
      lastEvent,
      clearUnread,
      addToastNotification
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
