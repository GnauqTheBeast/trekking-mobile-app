import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

interface WebSocketNotification {
  id: string;
  user_id: string;
  name: string;
  description: string;
}

class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private messageListeners: ((data: any) => void)[] = [];
  private eventEmitter: SimpleEventEmitter;

  private constructor() {
    this.eventEmitter = new SimpleEventEmitter();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public async connect(userId: string) {
    try {

      const encodedToken = encodeURIComponent('Bearer ' + userId || '');

      console.log('🚀 [WebSocketService] Connecting to WebSocket with token:', encodedToken);

      this.ws = new WebSocket(`ws://10.0.2.2:8082/ws?token=${encodedToken}`);

      this.ws.onopen = () => {
        console.log('WebSocket Connected Successfully');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          const notification: WebSocketNotification = {
            id: data.ID || data.id,
            user_id: data.UserID || data.user_id,
            name: data.Name || data.name,
            description: data.Description || data.description
          };

          if (notification.id && notification.user_id) {
            this.eventEmitter.emit('notification', notification);
          }

          this.messageListeners.forEach(listener => listener(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          console.error('Raw message was:', event.data);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket Disconnected with code:', event.code);
        console.log('Close reason:', event.reason);
        // this.handleReconnect(userId);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  private handleReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(userId);
      }, this.reconnectTimeout);
    }
  }

  public disconnect() {
    if (this.ws) {
      console.log('Manually disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }

  public onNotification(callback: (notification: WebSocketNotification) => void) {
    return this.eventEmitter.on('notification', callback);
  }

  public addMessageListener(listener: (data: any) => void) {
    this.messageListeners.push(listener);
  }

  public removeMessageListener(listener: (data: any) => void) {
    this.messageListeners = this.messageListeners.filter(l => l !== listener);
  }

  public sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected. Current state:', this.ws?.readyState);
    }
  }
}

export const wsService = WebSocketService.getInstance();