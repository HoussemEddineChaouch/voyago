import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Destination } from '../models/destination';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private apiUrl = `${environment.apiUrl}/destinations`;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Destination[]>(this.apiUrl);
  }
}
