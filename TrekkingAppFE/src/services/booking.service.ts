import axios from 'axios';
import { BOOKING_API_URL } from '../config';
import { BookingProps } from '../types/booking';
import { trekService } from './trek.service';

interface CreateBookingData {
  user_id: string;
  tour_id: string;
  porter_id?: string;
  quantity: number;
  total_price: number;
}

class BookingService {
  async createBooking(data: CreateBookingData, token: string) {
    try {
      const response = await axios.post(`${BOOKING_API_URL}/booking/create`, {
        ...data,
        status: 'PENDING'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPendingBookingByUserId(userId: string, token: string): Promise<BookingProps[]> {
    try {
      const response = await axios.get(`${BOOKING_API_URL}/booking/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const bookings = response.data.data;
      const bookingsWithTrek = await Promise.all(
        bookings.map(async (booking: any) => {
          try {
            const trekResponse = await trekService.getTrekById(booking.tour_id);
            const trekData = trekResponse.data?.message;
            trekData.images = JSON.parse(trekData.images);
            console.log("TrekResponse: ", trekResponse)
            console.log("TrekData: ", trekData)
            return {
              ...booking,
              trek: {
                ...trekData
              },
            };
          } catch (err) {
            console.warn(`Failed to load trek ${booking.tour_id}`, err);
            return booking;
          }
        })
      );

      console.log("Booking with Treks: ", bookingsWithTrek)
      const pendingBooking = bookingsWithTrek.filter(booking => booking.status === 'PENDING');
      return pendingBooking;
    } catch (error) {
      throw error;
    }
  }

  async getCompletedBookingByUserId(userId: string, token: string): Promise<BookingProps[]> {
    try {
      const response = await axios.get(`${BOOKING_API_URL}/booking/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const bookings = response.data.data;
      const bookingsWithTrek = await Promise.all(
        bookings.map(async (booking: any) => {
          try {
            const trekResponse = await trekService.getTrekById(booking.tour_id);
            const trekData = trekResponse.data?.message;
            trekData.images = JSON.parse(trekData.images);
            console.log("TrekResponse: ", trekResponse)
            console.log("TrekData: ", trekData)
            return {
              ...booking,
              trek: {
                ...trekData
              },
            };
          } catch (err) {
            console.warn(`Failed to load trek ${booking.tour_id}`, err);
            return booking;
          }
        })
      );

      console.log("Booking with Treks: ", bookingsWithTrek)
      const pendingBooking = bookingsWithTrek.filter(booking => booking.status === 'COMPLETED');
      return pendingBooking;
    } catch (error) {
      throw error;
    }
  }

}

export const bookingService = new BookingService();
