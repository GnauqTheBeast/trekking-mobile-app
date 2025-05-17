import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'PAYMENT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

class PaymentService {
  private async getHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async deposit(amount: number, description: string): Promise<Transaction> {
    const user = await AsyncStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    
    const response = await axios.post(
      `${API_URL}/api/payment/deposit`,
      {
        userId,
        amount,
        description
      },
      { headers: await this.getHeaders() }
    );
    return response.data;
  }

  async withdraw(amount: number, description: string): Promise<Transaction> {
    const user = await AsyncStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    
    const response = await axios.post(
      `${API_URL}/api/payment/withdraw`,
      {
        userId,
        amount,
        description
      },
      { headers: await this.getHeaders() }
    );
    return response.data;
  }

  async getTransactions(): Promise<Transaction[]> {
    const user = await AsyncStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    
    const response = await axios.get(
      `${API_URL}/api/payment/transactions/${userId}`,
      { headers: await this.getHeaders() }
    );
    return response.data;
  }

  async getAccount(): Promise<Account> {
    const user = await AsyncStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    
    const response = await axios.get(
      `${API_URL}/api/payment/account/${userId}`,
      { headers: await this.getHeaders() }
    );
    return response.data;
  }
}

export const paymentService = new PaymentService(); 