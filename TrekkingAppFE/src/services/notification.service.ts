import PushNotification from 'react-native-push-notification';
import { Platform, PushNotificationIOS } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { NotificationData } from '../types/notification';

import {
  fetchUserNotifications as fetchMockNotifications,
  markNotificationAsRead as markMockNotificationAsRead,
  markAllNotificationsAsRead as markAllMockNotificationsAsRead,
  clearAllNotifications as clearAllMockNotifications
} from '../mocks/mockNotificationService';

interface DeviceToken {
  os: string;
  token: string;
}


// Khóa lưu trữ cho AsyncStorage
const NOTIFICATION_STORAGE_KEY = '@booking_app_notifications';
const USE_MOCK_DATA = true;

// Cấu hình thông báo push
export const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function(token: DeviceToken) {
      // Lưu token để sử dụng cho thông báo từ server
      saveDeviceToken(token);
    },
    onNotification: function(notification: any) {
      console.log('NOTIFICATION:', notification);

      // Xử lý khi nhấn vào thông báo
      if (notification.data && notification.userInteraction) {
        handleNotificationOpen(notification.data);
      }

      // Lưu thông báo vào bộ nhớ local
      if (notification.data) {
        saveNotificationToStorage(notification.data);
      }

      // Required on iOS only
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

  // Tạo các kênh thông báo cho Android
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

// Lưu token thiết bị
const saveDeviceToken = async (token: DeviceToken) => {
  try {
    await AsyncStorage.setItem('@device_token', JSON.stringify(token));
  } catch (error) {
    console.error('Error saving device token:', error);
  }
};

// Xử lý khi nhấn vào thông báo
const handleNotificationOpen = (notificationData: NotificationData) => {
  // Logic điều hướng sẽ được xử lý ở component
  console.log('Notification opened:', notificationData);
};

// Lưu thông báo vào bộ nhớ local
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

    // Lấy danh sách thông báo hiện tại
    const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    let storedNotifications = storedNotificationsStr ? JSON.parse(storedNotificationsStr) : [];

    // Kiểm tra xem thông báo đã tồn tại chưa (tránh trùng lặp)
    const existingIndex = storedNotifications.findIndex((item: any) => item.id === formattedNotification.id);
    if (existingIndex >= 0) {
      // Cập nhật thông báo hiện có
      storedNotifications[existingIndex] = formattedNotification;
    } else {
      // Thêm thông báo mới
      storedNotifications.unshift(formattedNotification);
    }

    // Giới hạn số lượng thông báo (giữ 100 thông báo gần nhất)
    if (storedNotifications.length > 100) {
      storedNotifications = storedNotifications.slice(0, 100);
    }

    // Lưu lại danh sách thông báo
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(storedNotifications));

    return formattedNotification;
  } catch (error) {
    console.error('Error saving notification to storage:', error);
    return null;
  }
};

// Lấy danh sách thông báo của người dùng
export const fetchUserNotifications = async (userId: string) => {
  if (USE_MOCK_DATA) {
    return fetchMockNotifications(userId);
  }
  try {
    const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!storedNotificationsStr) return [];

    const allNotifications = JSON.parse(storedNotificationsStr);

    // Lọc theo userId (nếu được cung cấp)
    let userNotifications = userId
      ? allNotifications.filter((notification: NotificationData) => !notification.userId || notification.userId === userId)
      : allNotifications;

    // Loại bỏ các thông báo đã hết hạn
    const now = new Date();
    userNotifications = userNotifications.filter((notification: NotificationData) =>
      !notification.expiresAt || new Date(notification.expiresAt) > now
    );

    // Sắp xếp theo thời gian (mới nhất trước)
    return userNotifications.sort((a: NotificationData, b: NotificationData) =>
    {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })} catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (notificationId: string) => {
  if (USE_MOCK_DATA) {
    return markMockNotificationAsRead(notificationId);
  }
  try {
    const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!storedNotificationsStr) return false;

    const notifications = JSON.parse(storedNotificationsStr);
    const notificationIndex = notifications.findIndex((n: NotificationData) => n.id === notificationId);

    if (notificationIndex >= 0) {
      notifications[notificationIndex].isRead = true;
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = async (userId: string) => {
  if (USE_MOCK_DATA) {
    return markAllMockNotificationsAsRead(userId);
  }
  try {
    const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!storedNotificationsStr) return false;

    let notifications = JSON.parse(storedNotificationsStr);

    // Nếu có userId, chỉ đánh dấu thông báo của người dùng đó
    if (userId) {
      notifications = notifications.map((notification: NotificationData) => {
        if (!notification.userId || notification.userId === userId) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
    } else {
      // Đánh dấu tất cả
      notifications = notifications.map((notification: NotificationData) => ({ ...notification, isRead: true }));
    }

    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

// Xóa thông báo
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

// Xóa tất cả thông báo
export const clearAllNotifications = async (userId: string) => {
  if (USE_MOCK_DATA) {
    return clearAllMockNotifications(userId);
  }
  try {
    if (userId) {
      // Xóa chỉ thông báo của người dùng cụ thể
      const storedNotificationsStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (!storedNotificationsStr) return true;

      const notifications = JSON.parse(storedNotificationsStr);
      const remainingNotifications = notifications.filter((n: NotificationData) => n.userId && n.userId !== userId);

      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(remainingNotifications));
    } else {
      // Xóa tất cả thông báo
      await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
    }
    return true;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
};

// Xóa các thông báo hết hạn
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

// Hiển thị thông báo trên thiết bị và lưu vào bộ nhớ
export const showNotification = async (notificationData: NotificationData) => {
  // Lưu vào bộ nhớ local trước
  const savedNotification = await saveNotificationToStorage(notificationData);

  // Xác định kênh thông báo dựa trên loại
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

  // Hiển thị thông báo trên thiết bị
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

// Lên lịch thông báo
export const scheduleNotification = async (notificationData: NotificationData, date: Date) => {
  if (!notificationData || !date) {
    console.error('Invalid notification data or date');
    return null;
  }

  // Lưu vào bộ nhớ local trước
  const savedNotification = await saveNotificationToStorage({
    ...notificationData,
    scheduled: true
  });

  // Xác định kênh thông báo dựa trên loại
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

  // Lên lịch thông báo
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
    // Dữ liệu bổ sung
    data: savedNotification
  });

  return savedNotification;
};

// Hủy tất cả thông báo đã lên lịch
export const cancelAllScheduledNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

// Hàm chính để thực hiện đầy đủ quy trình thông báo
export const sendNotification = async (notification: NotificationData) => {
  try {
    // 1. Hiển thị thông báo hệ thống
    const savedNotification = await showNotification(notification);

    // 2. Thông báo đã được lưu vào bộ nhớ local trong hàm showNotification

    // 3. Thêm logic để gửi thông báo lên server nếu cần
    // Ví dụ: API call để lưu thông báo vào database

    return savedNotification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};
