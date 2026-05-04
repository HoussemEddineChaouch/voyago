import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private _user = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem('token'));

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // On app start, if we have a token fetch fresh user data from backend
    if (this._token()) {
      this.fetchMe();
    }
  }

  private loadUser(): User | null {
    try {
      const u = localStorage.getItem('user');
      if (!u || u === 'undefined' || u === 'null') return null;
      return JSON.parse(u);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  // Fetch full user profile
  fetchMe() {
    return this.http
      .get<{ user: User }>(`${this.apiUrl}/me`)
      .pipe(
        tap((res) => {
          localStorage.setItem('user', JSON.stringify(res.user));
          this._user.set(res.user);
        }),
      )
      .subscribe({ error: () => {} });
  }

  register(data: RegisterRequest) {
    return this.http.post<{ message: string; userId: string }>(
      `${this.apiUrl}/register`,
      data,
    );
  }

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        this.setSession(res);
        this.fetchMe();
      }),
    );
  }

  verifyOTP(email: string, otp: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/verify-otp`, { email, otp })
      .pipe(
        tap((res) => {
          this.setSession(res);
          this.fetchMe();
        }),
      );
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email },
    );
  }

  resetPassword(email: string, otp: string, password: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      { email, otp, password },
    );
  }

  updateProfile(data: { name: string; phone: string; country: string }) {
    return this.http.put<{ user: User }>(`${this.apiUrl}/profile`, data).pipe(
      tap((res) => {
        const updated = { ...this._user()!, ...res.user };
        localStorage.setItem('user', JSON.stringify(updated));
        this._user.set(updated);
      }),
    );
  }

  private setSession(res: AuthResponse) {
    if (!res?.token) return;
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user ?? null));
    this._token.set(res.token);
    this._user.set(res.user ?? null);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  setTokenFromGoogle(token: string) {
    localStorage.setItem('token', token);
    this._token.set(token);
    this.fetchMe();
  }
}
