import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAYMENT_API_URL } from '../config';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'payment';
  status: 'processing' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}


class PaymentService {
  private async getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  async deposit(userId: string, amount: number, description: string): Promise<Transaction> {
    try {
      console.log('🚀 [Payment API] Deposit Request:', {
        url: `${PAYMENT_API_URL}/deposit`,
        body: { userId, amount, description }
      });

      const response = await axios.post(`${PAYMENT_API_URL}/deposit`, {
        userId,
        amount,
        description
      }, {
        headers: await this.getHeaders()
      });

      console.log('✅ [Payment API] Deposit Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Payment API] Deposit Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async withdraw(userId: string, amount: number, description: string): Promise<Transaction> {
    try {
      console.log('🚀 [Payment API] Withdraw Request:', {
        url: `${PAYMENT_API_URL}/withdraw`,
        body: { userId, amount, description }
      });

      const response = await axios.post(`${PAYMENT_API_URL}/withdraw`, {
        userId,
        amount,
        description
      }, {
        headers: await this.getHeaders()
      });

      console.log('✅ [Payment API] Withdraw Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Payment API] Withdraw Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      console.log('🚀 [Payment API] Get Transactions Request:', {
        url: `${PAYMENT_API_URL}/transactions/${userId}`,
      });

      const response = await axios.get(`${PAYMENT_API_URL}/transactions/${userId}`, {
        headers: await this.getHeaders()
      });

      console.log('✅ [Payment API] Get Transactions Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Payment API] Get Transactions Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async getAccount(userId: string): Promise<Account> {
    try {
      console.log('🚀 [Payment API] Get Account Request:', {
        url: `${PAYMENT_API_URL}/account/${userId}`,
      });

      const response = await axios.get(`${PAYMENT_API_URL}/account/${userId}`, {
        headers: await this.getHeaders()
      });

      console.log('✅ [Payment API] Get Account Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Payment API] Get Account Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async processPayment(bookingId: string): Promise<Transaction> {
    try {
      console.log('🚀 [Payment API] Process Payment Request:', {
        url: `${PAYMENT_API_URL}/process/${bookingId}`
      });

      const response = await axios.post(`${PAYMENT_API_URL}/process/${bookingId}`, {}, {
        headers: await this.getHeaders()
      });

      console.log('✅ [Payment API] Process Payment Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [Payment API] Process Payment Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
}

export const paymentService = new PaymentService();