import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VoyageService } from '../../services/voyage.service';
import { AuthService } from '../../services/auth.service';
import { Voyage } from '../../models/voyage';

const SERVICE_FEE = 49;

@Component({
  selector: 'app-voyage-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    DecimalPipe,
  ],
  templateUrl: './voyage-detail.component.html',
})
export class VoyageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private voyageService = inject(VoyageService);
  auth = inject(AuthService);

  voyage = signal<Voyage | null>(null);
  travelers = signal(1);
  departureDate = signal('');
  serviceFee = SERVICE_FEE;

  get subtotal() {
    return (this.voyage()?.price ?? 0) * this.travelers();
  }
  get total() {
    return this.subtotal + this.serviceFee;
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.voyageService.getBySlug(slug).subscribe((v) => this.voyage.set(v));
  }

  get imageUrl() {
    const img = this.voyage()?.image;
    if (!img) return '';
    return img.startsWith('http')
      ? img
      : `http://localhost:5000/uploads/${img}`;
  }

  bookNow() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }
    this.router.navigate(['/booking', this.voyage()!.slug], {
      queryParams: { travelers: this.travelers(), date: this.departureDate() },
    });
  }
}
