import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AuthService } from '../../../services/auth.service';

type Step = 'email' | 'reset' | 'done';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  step = signal<Step>('email');
  email = signal('');
  otp = signal('');
  password = signal('');
  confirm = signal('');
  loading = signal(false);
  error = signal('');

  //Step 1: send OTP
  sendCode() {
    if (!this.email()) {
      this.error.set('Please enter your email.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.auth.forgotPassword(this.email()).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set('reset');
      },
      error: (e) => {
        this.error.set(e.error?.message ?? 'Failed to send code.');
        this.loading.set(false);
      },
    });
  }

  // Step 2: verify OTP + set new password
  resetPassword() {
    this.error.set('');

    if (!this.otp() || this.otp().length < 6) {
      this.error.set('Please enter the 6-digit code.');
      return;
    }
    if (!this.password() || this.password().length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }
    if (this.password() !== this.confirm()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.auth
      .resetPassword(this.email(), this.otp(), this.password())
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.step.set('done');
          setTimeout(() => this.router.navigate(['/auth']), 2500);
        },
        error: (e) => {
          this.error.set(e.error?.message ?? 'Reset failed. Check your code.');
          this.loading.set(false);
        },
      });
  }

  resendCode() {
    this.step.set('email');
    this.otp.set('');
    this.error.set('');
  }
}
