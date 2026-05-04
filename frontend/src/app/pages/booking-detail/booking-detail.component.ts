import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/booking';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './booking-detail.component.html',
})
export class BookingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);
  auth = inject(AuthService);

  booking = signal<Booking | null>(null);
  loading = signal(true);
  apiBase = environment.apiUrl.replace('/api', '');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.bookingService.getMyBookings().subscribe((bookings) => {
      const found = bookings.find((b) => b._id === id) ?? null;
      this.booking.set(found);
      this.loading.set(false);
    });
  }

  get imageUrl() {
    const img = (this.booking()?.voyage as any)?.image;
    if (!img) return 'assets/placeholder.jpg';
    return img.startsWith('http') ? img : `${this.apiBase}/uploads/${img}`;
  }

  voyageTitle() {
    return (this.booking()?.voyage as any)?.title ?? '—';
  }
  voyagePrice() {
    return (this.booking()?.voyage as any)?.price ?? 0;
  }
  voyageDuration() {
    return (this.booking()?.voyage as any)?.duration ?? 0;
  }
  destName() {
    return (this.booking()?.voyage as any)?.destination?.name ?? '—';
  }
  userName() {
    return (this.booking()?.user as any)?.name ?? '—';
  }
  userEmail() {
    return (this.booking()?.user as any)?.email ?? '—';
  }

  statusClass(status: string) {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PAID: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-gray-100 text-gray-500',
    };
    return map[status] ?? '';
  }

  get backUrl() {
    return this.auth.isAdmin() ? '/admin' : '/dashboard';
  }
}
