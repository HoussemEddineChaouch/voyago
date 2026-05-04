import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AdminService } from '../../../services/admin.service';
import { VoyageService } from '../../../services/voyage.service';
import { DestinationService } from '../../../services/destination.service';
import { AuthService } from '../../../services/auth.service';
import { Booking } from '../../../models/booking';
import { Voyage } from '../../../models/voyage';
import { Destination } from '../../../models/destination';
import { environment } from '../../../environments/environment';
type Tab = 'bookings' | 'voyages' | 'destinations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SlicePipe,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],

  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private voyageService = inject(VoyageService);
  private destService = inject(DestinationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);

  activeTab = signal<Tab>('bookings');
  bookings = signal<Booking[]>([]);
  voyages = signal<Voyage[]>([]);
  destinations = signal<Destination[]>([]);
  loading = signal(false);

  apiBase = environment.apiUrl.replace('/api', '');

  // Computed stats
  totalBookings = computed(() => this.bookings().length);
  pendingCount = computed(
    () => this.bookings().filter((b) => b.status === 'PENDING').length,
  );
  revenue = computed(() =>
    this.bookings()
      .filter((b) => b.status === 'PAID')
      .reduce((sum, b) => sum + b.totalPrice, 0),
  );
  customers = computed(
    () => new Set(this.bookings().map((b) => this.bookingUserEmail(b))).size,
  );

  ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      if (p['tab']) this.activeTab.set(p['tab'] as Tab);
    });
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.adminService.getAllBookings().subscribe((b) => {
      this.bookings.set(b);
      this.loading.set(false);
    });
    this.voyageService
      .getAll({ limit: 100 })
      .subscribe((r) => this.voyages.set(r.voyages));
    this.destService.getAll().subscribe((d) => this.destinations.set(d));
  }

  // Safe accessor helpers
  bookingUserName(b: Booking): string {
    const u = b.user as any;
    return u?.name ?? u?.email ?? '—';
  }

  bookingUserEmail(b: Booking): string {
    const u = b.user as any;
    return u?.email ?? '—';
  }

  bookingVoyageTitle(b: Booking): string {
    const v = b.voyage as any;
    return v?.title ?? '—';
  }

  // Tab switching
  setTab(t: Tab) {
    this.activeTab.set(t);
  }

  // Booking status change
  changeBookingStatus(id: string, status: string) {
    this.adminService
      .updateBookingStatus(id, status as 'PENDING' | 'PAID' | 'CANCELLED')
      .subscribe(() => this.loadAll());
  }

  // Voyage CRUD
  editVoyage(voyage: Voyage) {
    this.router.navigate(['/admin/voyages/edit', voyage._id]);
  }

  deleteVoyage(id: string) {
    if (!confirm('Delete this voyage?')) return;
    this.adminService.deleteVoyage(id).subscribe(() => {
      this.voyages.update((vs) => vs.filter((v) => v._id !== id));
    });
  }

  // Destination CRUD
  editDestination(dest: Destination) {
    this.router.navigate(['/admin/destinations/edit', dest._id]);
  }

  deleteDestination(id: string) {
    if (!confirm('Delete this destination?')) return;
    this.adminService.deleteDestination(id).subscribe(() => {
      this.destinations.update((ds) => ds.filter((d) => d._id !== id));
    });
  }

  // Helpers
  imageUrl(img: string): string {
    if (!img) return 'assets/placeholder.jpg';
    return img.startsWith('http') ? img : `${this.apiBase}/uploads/${img}`;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PAID: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-gray-100 text-gray-500',
    };
    return map[status] ?? '';
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
