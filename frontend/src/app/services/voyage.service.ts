import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Voyage, VoyagesResponse } from '../models/voyage';

export interface VoyageFilters {
  destination?: string;
  maxPrice?: number;
  date?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class VoyageService {
  private apiUrl = `${environment.apiUrl}/voyages`;

  constructor(private http: HttpClient) {}

  getAll(filters: VoyageFilters = {}) {
    let params = new HttpParams();
    if (filters.destination)
      params = params.set('destination', filters.destination);
    if (filters.maxPrice)
      params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.date) params = params.set('date', filters.date);
    if (filters.featured) params = params.set('featured', 'true');
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    return this.http.get<VoyagesResponse>(this.apiUrl, { params });
  }

  getBySlug(slug: string) {
    return this.http.get<Voyage>(`${this.apiUrl}/${slug}`);
  }
}
