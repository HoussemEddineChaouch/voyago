import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

type Tab = 'signin' | 'signup' | 'otp';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tab = signal<Tab>('signin');
  email = signal('');
  password = signal('');
  name = signal('');
  otp = signal('');
  error = signal('');
  loading = signal(false);
  // After register, store email for OTP step
  pendingEmail = signal('');

  ngOnInit() {
    const t = this.route.snapshot.queryParamMap.get('tab');
    if (t === 'signup') this.tab.set('signup');
    // Google callback token
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.auth.setTokenFromGoogle(token);
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.loading.set(true);
    this.error.set('');
    this.auth
      .login({ email: this.email(), password: this.password() })
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (e) => {
          this.error.set(e.error?.message ?? 'Login failed');
          this.loading.set(false);
        },
      });
  }

  register() {
    this.loading.set(true);
    this.error.set('');
    this.auth
      .register({
        name: this.name(),
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          this.pendingEmail.set(this.email());
          this.tab.set('otp');
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.message ?? 'Registration failed');
          this.loading.set(false);
        },
      });
  }

  verifyOTP() {
    this.loading.set(true);
    this.error.set('');
    this.auth.verifyOTP(this.pendingEmail(), this.otp()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => {
        this.error.set(e.error?.message ?? 'Invalid OTP');
        this.loading.set(false);
      },
    });
  }

  googleLogin() {
    window.location.href = 'http://localhost:5000/auth/google';
  }
}
