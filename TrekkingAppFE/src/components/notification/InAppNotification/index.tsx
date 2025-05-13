import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';


interface InAppNotificationProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    onDismiss?: () => void;
    duration?: number;
  }

const InAppNotification:React.FC<InAppNotificationProps> = ({
        visible,
        title,
        message,
        type = 'info',
        onDismiss,
        duration = 3000
    }) => {
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
        // Hiện thông báo
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Tự động ẩn sau khoảng thời gian duration
        const timer = setTimeout(() => {
            hideNotification();
        }, duration);

        return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideNotification = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (onDismiss) onDismiss();
        });
    };

  // Xác định màu sắc dựa trên loại thông báo
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#2196F3';
    }
  };

  // Xác định icon dựa trên loại thông báo
  const getIcon = () => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: animation,
          transform: [{
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0]
            })
          }]
        }
      ]}
    >
      <View style={styles.content}>
        <Icon name={getIcon()} size={24} color="#FFF" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
        <Icon name="close" size={20} color="#FFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default InAppNotification;