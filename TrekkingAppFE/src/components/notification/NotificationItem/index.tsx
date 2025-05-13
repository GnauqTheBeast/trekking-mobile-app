import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatTimeAgo } from '../../../utils/date.util';
import { NotificationItemProps } from '../../../types/notification';



const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <Icon name="check-circle" size={32} color="#4CAF50" />;
      case 'warning': return <Icon name="warning" size={32} color="#FF9800" />;
      case 'error': return <Icon name="error" size={32} color="#F44336" />;
      case 'promotion': return <Icon name="local-offer" size={32} color="#FF8E4F" />;
      case 'trip': return <Icon name="flight" size={32} color="#FF8E4F" />;
      case 'booking': return <Icon name="hotel" size={32} color="#FF8E4F" />;
      case 'payment': return <Icon name="payment" size={32} color="#FF8E4F" />;
      default: return <Icon name="notifications" size={32} color="#FF8E4F" />;
    }
  };

    return (
        <TouchableOpacity
          style={[styles.container, !notification.isRead && styles.unreadItem]}
          onPress={() => onPress(notification)}
        >
            <View style={styles.iconContainer}>
                {getNotificationIcon(notification.type)}
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
                <Text style={styles.time}>{formatTimeAgo(notification.createdAt)}</Text>
            </View>
            {!notification.isRead && <View style={styles.unreadIndicator} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
  },
  unreadItem: {
    backgroundColor: '#E1F2DC',
  },
  iconContainer: {
    marginLeft: 10,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    color:'#2A5848',
  },
  message: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#000',
    marginBottom: 0,
  },
  time: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#9E9E9E',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A5848',
    alignSelf: 'center',
    marginLeft: 8,
  },
});

export default NotificationItem;