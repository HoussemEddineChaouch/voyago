import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VoyageService } from '../../services/voyage.service';
import { BookingService } from '../../services/booking.service';
import { StripeService } from '../../services/stripe.service';
import { AuthService } from '../../services/auth.service';
import { Voyage } from '../../models/voyage';

const SERVICE_FEE = 49;

type Step = 'details' | 'payment' | 'success';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DecimalPipe,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private voyageService = inject(VoyageService);
  private bookingService = inject(BookingService);
  private stripeService = inject(StripeService);
  auth = inject(AuthService);

  voyage = signal<Voyage | null>(null);
  travelers = signal(1);
  departureDate = signal('');
  phone = signal('');
  specialRequests = signal('');
  step = signal<Step>('details');
  error = signal('');
  loading = signal(false);
  clientSecret = signal('');
  bookingId = signal('');
  serviceFee = SERVICE_FEE;
  cardReady = signal(false);

  get subtotal() {
    return (this.voyage()?.price ?? 0) * this.travelers();
  }
  get total() {
    return this.subtotal + this.serviceFee;
  }

  get imageUrl() {
    const img = this.voyage()?.image;
    if (!img) return '';
    return img.startsWith('http')
      ? img
      : `http://localhost:5000/uploads/${img}`;
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const params = this.route.snapshot.queryParams;
    if (params['travelers']) this.travelers.set(+params['travelers']);
    if (params['date']) this.departureDate.set(params['date']);

    this.voyageService.getBySlug(slug).subscribe((v) => this.voyage.set(v));
  }

  ngOnDestroy() {
    this.stripeService.destroyCard();
  }

  // ── Step 1: Create booking + PaymentIntent ──────────────────────────────────
  confirmBooking() {
    const v = this.voyage();
    if (!v) return;
    if (!this.departureDate()) {
      this.error.set('Please select a departure date.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.bookingService
      .create({
        voyageId: v._id,
        travelers: this.travelers(),
        departureDate: this.departureDate(),
        phone: this.phone(),
        specialRequests: this.specialRequests(),
      })
      .subscribe({
        next: async (res) => {
          this.clientSecret.set(res.clientSecret);
          this.bookingId.set(res.booking._id);
          this.loading.set(false);
          this.step.set('payment');

          // Mount Stripe card element after view updates
          setTimeout(async () => {
            await this.stripeService.mountCard('card-element');
            this.cardReady.set(true);
          }, 100);
        },
        error: (e) => {
          this.error.set(
            e.error?.message ?? 'Booking failed. Please try again.',
          );
          this.loading.set(false);
        },
      });
  }

  // ── Step 2: Confirm Stripe payment ─────────────────────────────────────────
  async pay() {
    this.loading.set(true);
    this.error.set('');

    try {
      const result = await this.stripeService.confirmPayment(
        this.clientSecret(),
        this.auth.user()?.name ?? 'Guest',
      );

      if (result.error) {
        this.error.set(result.error.message ?? 'Payment failed.');
        this.loading.set(false);
      } else if (result.paymentIntent?.status === 'succeeded') {
        this.step.set('success');
        this.loading.set(false);
        // Webhook will set booking to PAID on the backend
        setTimeout(() => this.router.navigate(['/dashboard']), 3000);
      }
    } catch (err: any) {
      this.error.set(err.message ?? 'Unexpected error.');
      this.loading.set(false);
    }
  }

  goBackToDetails() {
    this.step.set('details');
    this.stripeService.destroyCard();
    this.cardReady.set(false);
  }
}
