import axios from 'axios';
import { TREK_API_URL } from '../config';

const TREK_API = `${TREK_API_URL}`;

interface CreateTrekData {
  name: string;
  description: string;
  host_id: string;
  price: number;
  level: string;
  distance: number;
  elevation: number;
  duration: string;
  location: string;
  images: string;
  rate: string;
  slot: number;
  available_slot: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  start_at: string;
  end_at: string;
}

interface UpdateTrekData {
  name?: string;
  description?: string;
  price?: number;
  level?: string;
  distance?: number;
  elevation?: number;
  duration?: string;
  location?: string;
  images?: string;
  slot?: number;
  start_at?: string;
  end_at?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export const trekService = {
  getTreks: async (page: number, limit: number) => {
    try {
      const response = await axios.get(`${TREK_API}/tours?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error in getTreks:', error);
      throw error;
    }
  },

  getHostTreks: async (hostId: string) => {
    try {
      const response = await axios.get(`${TREK_API}/${hostId}/tours`);
      return response;
    } catch (error) {
      console.error('Axios error:', error);
      throw error;
    }
  },

  getTrekById: async (id: string) => {
    try {
      const response = await axios.get(`${TREK_API}/tours/${id}`);
      return response;
    } catch (error) {
      console.error('Error in getTrekById:', error);
      throw error;
    }
  },

  createTrek: async (trekData: CreateTrekData) => {
    try {
      const response = await axios.post(`${TREK_API}/tours`, trekData);

      console.log('createTrek response', response);

      return response;
    } catch (error) {
      console.error('Error in createTrek:', error);
      throw error;
    }
  },

  updateTrek: async (id: string, trekData: UpdateTrekData) => {
    try {
      console.log('trekData', trekData);
      const response = await axios.patch(`${TREK_API}/tours/${id}`, trekData);

      console.log('updateTrek response', response);

      return response;
    } catch (error) {
      console.error('Error in updateTrek:', error);
      throw error;
    }
  },

  deleteTrek: async (id: string) => {
    try {
      const response = await axios.delete(`${TREK_API}/tours/${id}`);

      console.log('deleteTrek response', response);

      return response;
    } catch (error) {
      console.error('Error in deleteTrek:', error);
      throw error;
    }
  }
}; 
