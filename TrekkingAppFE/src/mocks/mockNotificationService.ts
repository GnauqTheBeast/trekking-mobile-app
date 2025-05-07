// src/mocks/mockNotificationService.js
import { MOCK_NOTIFICATIONS } from './mockNotifications';

// Biến để lưu trạng thái mock
let mockNotifications = [...MOCK_NOTIFICATIONS];

export const fetchUserNotifications = async (userId: string) => {
  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockNotifications];
};

export const markNotificationAsRead = async (notificationId: string) => {
  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 300));

  // Cập nhật trạng thái
  mockNotifications = mockNotifications.map(notification =>
    notification.id === notificationId
      ? { ...notification, isRead: true }
      : notification
  );

  return true;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cập nhật tất cả
  mockNotifications = mockNotifications.map(notification =>
    ({ ...notification, isRead: true })
  );

  return true;
};

export const clearAllNotifications = async (userId: string) => {
  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 500));

  // Xóa tất cả
  mockNotifications = [];

  return true;
};