import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VoyageCardComponent } from '../../components/voyage-card/voyage-card.component';
import { VoyageService } from '../../services/voyage.service';
import { DestinationService } from '../../services/destination.service';
import { Voyage } from '../../models/voyage';
import { Destination } from '../../models/destination';

@Component({
  selector: 'app-voyages',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    VoyageCardComponent,
  ],
  templateUrl: './voyages.component.html',
})
export class VoyagesComponent implements OnInit {
  private voyageService = inject(VoyageService);
  private destService = inject(DestinationService);
  private route = inject(ActivatedRoute);

  voyages = signal<Voyage[]>([]);
  destinations = signal<Destination[]>([]);
  total = signal(0);
  loading = signal(false);

  selectedDest = signal('');
  maxPrice = signal(3000);
  date = signal('');

  ngOnInit() {
    this.destService.getAll().subscribe((d) => this.destinations.set(d));
    this.route.queryParams.subscribe((p) => {
      if (p['destination']) this.selectedDest.set(p['destination']);
      this.load();
    });
  }

  load() {
    this.loading.set(true);
    this.voyageService
      .getAll({
        destination: this.selectedDest() || undefined,
        maxPrice: this.maxPrice(),
        date: this.date() || undefined,
      })
      .subscribe((res) => {
        this.voyages.set(res.voyages);
        this.total.set(res.total);
        this.loading.set(false);
      });
  }

  selectDest(id: string) {
    this.selectedDest.set(id);
    this.load();
  }
}
