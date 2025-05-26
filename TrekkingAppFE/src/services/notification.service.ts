import PushNotification from 'react-native-push-notification';
import { Platform, PushNotificationIOS } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { NotificationData } from '../types/notification';
import axios from 'axios';
import { NOTI_API_BASE_URL } from '../config';

interface DeviceToken {
  os: string;
  token: string;
}

const NOTIFICATION_STORAGE_KEY = '@booking_app_notifications';

const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  const token = await getAuthToken();

  try {
    const response = await axios({
      method,
      url: `${NOTI_API_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      data,
    });
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

const convertApiNotification = (apiNotification: any): NotificationData => {
  return {
    id: apiNotification.id,
    title: apiNotification.name,
    message: apiNotification.description,
    isRead: apiNotification.is_read,
    createdAt: apiNotification.created_at,
    userId: apiNotification.user_id,
    type: 'info',
  };
};

export const fetchUserNotifications = async (userId: string) => {
  try {
    const response = await apiCall(`/notifications/${userId}`);
    if (response.status_code === 200 && Array.isArray(response.data)) {
      return response.data.map(convertApiNotification);
    }
    return [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await apiCall(`/notifications/${notificationId}/read`, 'PUT');
    return response.status_code === 200;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (notificationIds: string[]) => {
  try {
    const response = await apiCall(`/notifications/read-all`, 'PUT', {
      notification_id: notificationIds
    });
    console.log("Response: ", response)
    return response.status_code === 200;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

export const clearAllNotifications = async (userId: string) => {
  try {
    const response = await apiCall(`/notifications/${userId}`, 'DELETE');
    return response.status_code === 200;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
};

export const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function(token: DeviceToken) {
      saveDeviceToken(token);
    },
    onNotification: function(notification: any) {
      console.log('NOTIFICATION:', notification);

      if (notification.data && notification.userInteraction) {
        handleNotificationOpen(notification.data);
      }

      if (notification.data) {
        saveNotificationToStorage(notification.data);
      }

      if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'booking-channel',
        channelName: 'Đặt phòng',
        channelDescription: 'Thông báo liên quan đến đặt phòng',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      () => {}
    );

    PushNotification.createChannel(
      {
        channelId: 'trip-channel',
        channelName: 'Chuyến đi',
        channelDescription: 'Thông báo liên quan đến chuyến đi',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      () => {}
    );

    PushNotification.createChannel(
      {
        channelId: 'promotion-channel',
        channelName: 'Khuyến mãi',
        channelDescription: 'Thông báo khuyến mãi và ưu đãi',
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      () => {}
    );
  }
};

const saveDeviceToken = async (token: DeviceToken) => {
  try {
    await AsyncStorage.setItem('@device_token', JSON.stringify(token));
  } catch (error) {
    console.error('Error saving device token:', error);
  }
};

const handleNotificationOpen = (notificationData: NotificationData) => {
  console.log('Notification opened:', notificationData);
};

export const saveNotificationToStorage = async (notification: NotificationData) => {
  try {
    const formattedNotification = {
      id: notification.id || uuid.v4(),
      title: notification.title,
      message: notification.message || notification.body,
      type: notification.type || 'info',
      isRead: false,
      createdAt: notification.createdAt || new Date().toISOString(),
      expiresAt: notification.expiresAt,
      actionData: notification.actionData,
      userId: notification.userId
    };

    const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    let storedNotifications = storedNotificationsStr ? JSON.parse(storedNotificationsStr) : [];

    const existingIndex = storedNotifications.findIndex((item: any) => item.id === formattedNotification.id);
    if (existingIndex >= 0) {
      storedNotifications[existingIndex] = formattedNotification;
    } else {
      storedNotifications.unshift(formattedNotification);
    }

    if (storedNotifications.length > 100) {
      storedNotifications = storedNotifications.slice(0, 100);
    }

    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(storedNotifications));

    return formattedNotification;
  } catch (error) {
    console.error('Error saving notification to storage:', error);
    return null;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!storedNotificationsStr) return false;

    const notifications = JSON.parse(storedNotificationsStr);
    const filteredNotifications = notifications.filter((n: NotificationData) => n.id !== notificationId);

    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(filteredNotifications));
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

export const cleanExpiredNotifications = async () => {
  try {
    const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!storedNotificationsStr) return true;

    const notifications = JSON.parse(storedNotificationsStr);
    const now = new Date();

    const validNotifications = notifications.filter((notification: NotificationData) =>
      !notification.expiresAt || new Date(notification.expiresAt) > now
    );

    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(validNotifications));
    return true;
  } catch (error) {
    console.error('Error cleaning expired notifications:', error);
    return false;
  }
};

export const showNotification = async (notificationData: NotificationData) => {
  const savedNotification = await saveNotificationToStorage(notificationData);

  let channelId = 'default-channel';
  switch (notificationData.type) {
    case 'booking':
      channelId = 'booking-channel';
      break;
    case 'trip':
      channelId = 'trip-channel';
      break;
    case 'promotion':
      channelId = 'promotion-channel';
      break;
    default:
      channelId = 'default-channel';
  }

  PushNotification.localNotification({
    channelId: channelId,
    title: notificationData.title,
    message: notificationData.message || notificationData.body || '',
    playSound: true,
    soundName: 'default',
    vibrate: true,
    vibration: 300,
    priority: 'high',
    visibility: 'public',
    autoCancel: true,
    // Dữ liệu bổ sung
    data: savedNotification
  });

  return savedNotification;
};

export const scheduleNotification = async (notificationData: NotificationData, date: Date) => {
  if (!notificationData || !date) {
    console.error('Invalid notification data or date');
    return null;
  }

  const savedNotification = await saveNotificationToStorage({
    ...notificationData,
    scheduled: true
  });

  let channelId = 'default-channel';
  switch (notificationData.type) {
    case 'booking':
      channelId = 'booking-channel';
      break;
    case 'trip':
      channelId = 'trip-channel';
      break;
    case 'promotion':
      channelId = 'promotion-channel';
      break;
    default:
      channelId = 'default-channel';
  }

  PushNotification.localNotificationSchedule({
    channelId: channelId,
    title: notificationData.title,
    message: notificationData.message || notificationData.body || '',
    date: date,
    playSound: true,
    soundName: 'default',
    vibrate: true,
    vibration: 300,
    priority: 'high',
    visibility: 'public',
    autoCancel: true,
    allowWhileIdle: true,
    data: savedNotification
  });

  return savedNotification;
};

export const cancelAllScheduledNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

export const sendNotification = async (notification: NotificationData) => {
  try {
    const savedNotification = await showNotification(notification);

    return savedNotification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};
