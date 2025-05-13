export interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    type: 'success' | 'warning' | 'error' | 'promotion' | 'trip' | 'booking' | 'payment' | string;
    isRead: boolean;
}

export interface NotificationItemProps {
    notification: Notification;
    onPress: (notification: Notification) => void;
}

export interface NotificationData {
    id?: string;
    title: string;
    message?: string;
    body?: string;
    type?: string;
    isRead?: boolean;
    createdAt?: string;
    expiresAt?: string;
    actionData?: {
        bookingId: string,
        screen?: string,
        params?: Record<string, any>;
    }
    userId?: string;
    scheduled?: boolean;
  }