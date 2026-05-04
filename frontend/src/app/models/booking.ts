import { Voyage } from './voyage';
import { User } from './user';

export interface Booking {
  _id: string;
  user: User;
  voyage: Voyage;
  departureDate: string;
  travelers: number;
  phone?: string;
  specialRequests?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentIntentId?: string; 
  totalPrice: number;
  serviceFee: number;
  createdAt: string;
}

export interface CreateBookingRequest {
  voyageId: string;
  travelers: number;
  departureDate: string;
  phone?: string;
  specialRequests?: string;
}

export interface BookingResponse {
  booking: Booking;
  clientSecret: string;
}
