import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  phone = signal('');
  country = signal('');
  saving = signal(false);
  success = signal(false);
  error = signal('');

  ngOnInit() {
    const u = this.auth.user();
    if (!u) {
      this.router.navigate(['/auth']);
      return;
    }
    this.name.set(u.name ?? '');
    this.phone.set(u.phone ?? '');
    this.country.set(u.country ?? '');
  }

  get userInitial() {
    return this.auth.user()?.name?.charAt(0).toUpperCase() ?? 'U';
  }

  save() {
    if (!this.name().trim()) {
      this.error.set('Name is required.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.success.set(false);

    this.auth
      .updateProfile({
        name: this.name(),
        phone: this.phone(),
        country: this.country(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/dashboard']), 1200);
        },
        error: (e) => {
          this.error.set(e.error?.message ?? 'Update failed');
          this.saving.set(false);
        },
      });
  }
}
