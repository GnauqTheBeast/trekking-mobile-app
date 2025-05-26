import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
// Import types
import {
  markAllNotificationsAsRead,
  clearAllNotifications,
  fetchUserNotifications
} from '../../../services/notification.service';
// import { AuthContext } from '../contexts/AuthContext';
import styles from './styles';
import NotificationCenter from '../../../components/notification/NotificationCenter';
import InAppNotification from '../../../components/notification/InAppNotification';
import { NotificationData } from '../../../types/notification';
import { AuthContext } from '../../../context/AuthProvider';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [isReadingAll, setIsReadingAll] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inAppNotification, setInAppNotification] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'error' | 'warning'
  });

  // Load notification counts
  useEffect(() => {
    if (user) {
      loadNotificationCounts();
    }
  }, [user]);

  const loadNotificationCounts = async () => {
    if (!user) return;

    try {
      const userId = user.id
      const notifications = await fetchUserNotifications(userId);
      setNotificationCount(notifications.length);

      const unreadNotifications = notifications.filter(
        (notification: NotificationData) => !notification.isRead
      );
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error loading notification counts:', error);
    }
  };

  // Handle marking all as read
  const handleMarkAllAsRead = async () => {
    if (!user || isReadingAll) return;

    setIsReadingAll(true);
    try {
      const userId = user.id;

      const notifications = await fetchUserNotifications(userId);

      const unreadNotifications = notifications.filter(
        (notification: NotificationData) => !notification.isRead
      );

      const unreadIds = unreadNotifications.map((n: any) => n.id);

      if (unreadIds.length > 0) {
        await markAllNotificationsAsRead(unreadIds);
      }

      setInAppNotification({
        visible: true,
        title: 'Thành công',
        message: 'Đã đánh dấu tất cả thông báo là đã đọc',
        type: 'success'
      });

      // Refresh counts
      loadNotificationCounts();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);

      // Show error notification
      setInAppNotification({
        visible: true,
        title: 'Lỗi',
        message: 'Không thể đánh dấu đã đọc tất cả thông báo',
        type: 'error'
      });
    } finally {
      setIsReadingAll(false);
    }
  };

  // Handle clearing all notifications
  const handleClearAll = async () => {
    if (!user || isClearing) return;

    setIsClearing(true);
    try {
      const userId = user.id;
      await clearAllNotifications(userId);

      // Show success notification
      setInAppNotification({
        visible: true,
        title: 'Thành công',
        message: 'Đã xóa tất cả thông báo',
        type: 'success'
      });

      // Refresh counts
      loadNotificationCounts();
    } catch (error) {
      console.error('Error clearing notifications:', error);

      // Show error notification
      setInAppNotification({
        visible: true,
        title: 'Lỗi',
        message: 'Không thể xóa tất cả thông báo',
        type: 'error'
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleNotificationsUpdate = (notifications: NotificationData[]) => {
    setNotificationCount(notifications.length);
    const unread = notifications.filter(notification => !notification.isRead);
    setUnreadCount(unread.length);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          {notificationCount > 0 && unreadCount > 0 && (
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          {notificationCount > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleClearAll}
              disabled={isClearing}
            >
              {!isClearing && <Icon name="delete-sweep" size={26} color="#FF8E4F" />}
            </TouchableOpacity>
          )}
        </View>
      </View>



      <View style={styles.container}>
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            disabled={isReadingAll || unreadCount === 0}
            style={styles.readAllTextContainer}
          >
            <Text style={styles.readAllText}>
              Đọc tất cả
            </Text>
          </TouchableOpacity>
        <NotificationCenter
          navigation={navigation}
          userId={user ? user.id : ''}
          onUpdate={handleNotificationsUpdate}
        />
        <View>
          <Text>Xoá tất cả</Text>
        </View>
      </View>

      <InAppNotification
        visible={inAppNotification.visible}
        title={inAppNotification.title}
        message={inAppNotification.message}
        type={inAppNotification.type}
        onDismiss={() => setInAppNotification(prev => ({ ...prev, visible: false }))}
        duration={3000}
      />
    </SafeAreaView>
  );
};



export default NotificationsScreen;