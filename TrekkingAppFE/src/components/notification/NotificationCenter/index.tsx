import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchUserNotifications, markNotificationAsRead } from '../../../services/notification.service';
import { Notification, NotificationData } from '../../../types/notification';
import NotificationItem from '../NotificationItem';


interface Props {
  navigation: any;
  userId: string;
  onUpdate?: (notifications: NotificationData[]) => void;
}

const NotificationCenter: React.FC<Props> = ({
    navigation,
    userId,
    onUpdate
  }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  useEffect(() => {
    if (onUpdate && notifications.length >= 0) {
      onUpdate(notifications);
    }
  }, [notifications, onUpdate]);

  const loadNotifications = async () => {
    if (refreshing) return;

    setLoading(true);
    try {
      const userNotifications = await fetchUserNotifications(userId);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const userNotifications = await fetchUserNotifications(userId);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    // Đánh dấu thông báo đã đọc
    if (!notification.isRead && notification.id) {
      await markNotificationAsRead(notification.id);
      // Cập nhật UI
      setNotifications(prev =>
        prev.map((item) =>
          item.id === notification.id ? {...item, isRead: true} : item
        )
      );
    }

    // Điều hướng dựa trên loại thông báo
    if (notification.actionData) {
      switch (notification.type) {
        case 'booking':
          navigation.navigate('BookingDetails', { bookingId: notification.actionData.bookingId });
          break;
        // case 'trip':
        //   navigation.navigate('TripDetails', { tripId: notification.actionData.tripId });
        //   break;
        // case 'promotion':
        //   navigation.navigate('PromotionDetails', { promoId: notification.actionData.promoId });
        //   break;
        // case 'payment':
        //   navigation.navigate('PaymentDetails', { paymentId: notification.actionData.paymentId });
        //   break;
        default:
          // Mặc định điều hướng đến màn hình thông tin chung
          if (notification.actionData.screen) {
            navigation.navigate(notification.actionData.screen, notification.actionData.params);
          }
      }
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-off" size={60} color="#BDBDBD" />
      <Text style={styles.emptyText}>Bạn chưa có thông báo nào</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item as Notification}
            onPress={handleNotificationPress}
          />
        )}
        keyExtractor={(item, index) => item.id ?? `notification-${index}`}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
});

export default NotificationCenter;