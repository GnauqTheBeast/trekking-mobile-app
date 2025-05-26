import React, { useContext, useEffect, useState } from 'react';
import { wsService } from '../../services/websocket.service';
import NotificationPopup from '../NotificationPopup';
import { AuthContext } from '../../context/AuthProvider';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Commented for development

interface WebSocketNotification {
  id: string;
  user_id: string;
  name: string;
  description: string;
}

const NotificationManager: React.FC = () => {

  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [notification, setNotification] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    const unsubscribe = wsService.onNotification((notification: WebSocketNotification) => {
      console.log('NotificationManager received notification:', notification);
      if(!user) return;
      if (user.id === notification.user_id) {
        console.log('Setting notification visible');
        setNotification({
          visible: true,
          title: notification.name,
          message: notification.description,
        });
      } else {
        console.log('User ID mismatch, not showing notification');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleDismiss = () => {
    console.log('Dismissing notification');
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  return (
    <NotificationPopup
      visible={notification.visible}
      title={notification.title}
      message={notification.message}
      onDismiss={handleDismiss}
    />
  );
};

export default NotificationManager;
