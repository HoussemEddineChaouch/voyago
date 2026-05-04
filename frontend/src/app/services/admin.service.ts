import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Booking } from '../models/booking';
import { Voyage } from '../models/voyage';
import { Destination } from '../models/destination';

export interface AdminStats {
  totalBookings: number;
  pending: number;
  customers: number;
  revenue: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Stats
  getStats() {
    return this.http.get<Booking[]>(`${this.api}/bookings`);
  }

  // Bookings
  getAllBookings() {
    return this.http.get<Booking[]>(`${this.api}/bookings`);
  }

  updateBookingStatus(id: string, status: 'PENDING' | 'PAID' | 'CANCELLED') {
    return this.http.patch<any>(`${this.api}/bookings/${id}`, { status });
  }

  deleteBooking(id: string) {
    return this.http.delete(`${this.api}/bookings/${id}`);
  }

  // Voyages
  createVoyage(formData: FormData) {
    return this.http.post<Voyage>(`${this.api}/voyages`, formData);
  }

  updateVoyage(id: string, formData: FormData) {
    return this.http.put<Voyage>(`${this.api}/voyages/${id}`, formData);
  }

  deleteVoyage(id: string) {
    return this.http.delete(`${this.api}/voyages/${id}`);
  }

  // Destinations
  createDestination(formData: FormData) {
    return this.http.post<Destination>(`${this.api}/destinations`, formData);
  }

  updateDestination(id: string, formData: FormData) {
    return this.http.put<Destination>(
      `${this.api}/destinations/${id}`,
      formData,
    );
  }

  deleteDestination(id: string) {
    return this.http.delete(`${this.api}/destinations/${id}`);
  }
}
