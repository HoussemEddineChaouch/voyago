import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/booking';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private bookingService = inject(BookingService);
  auth = inject(AuthService); // public — used in template

  bookings = signal<Booking[]>([]);
  loading = signal(true);
  apiBase = environment.apiUrl.replace('/api', '');

  get userInitial() {
    return this.auth.user()?.name?.charAt(0).toUpperCase() ?? 'U';
  }

  ngOnInit() {
    this.bookingService.getMyBookings().subscribe({
      next: (b) => {
        this.bookings.set(b);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  imageUrl(img: string) {
    if (!img) return 'assets/placeholder.jpg';
    return img.startsWith('http') ? img : `${this.apiBase}/uploads/${img}`;
  }

  cancel(id: string) {
    if (!confirm('Cancel this booking?')) return;
    this.bookingService.cancel(id).subscribe(() => {
      this.bookings.update((bs) =>
        bs.map((b) => (b._id === id ? { ...b, status: 'CANCELLED' } : b)),
      );
    });
  }

  statusClass(status: string) {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PAID: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-gray-100 text-gray-500',
    };
    return map[status] ?? '';
  }
}
