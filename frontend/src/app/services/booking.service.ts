import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import {
  Booking,
  BookingResponse,
  CreateBookingRequest,
} from '../models/booking';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;
  constructor(private http: HttpClient) {}

  create(data: CreateBookingRequest) {
    return this.http.post<BookingResponse>(this.apiUrl, data);
  }

  getMyBookings() {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  cancel(id: string) {
    return this.http.delete<Booking>(`${this.apiUrl}/${id}`);
  }
}
