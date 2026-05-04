import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DestinationCardComponent } from '../../components/destination-card/destination-card.component';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../../models/destination';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    DestinationCardComponent,
  ],
  templateUrl: './destinations.component.html',
})
export class DestinationsComponent implements OnInit {
  private service = inject(DestinationService);
  destinations = signal<Destination[]>([]);

  ngOnInit() {
    this.service.getAll().subscribe((d) => this.destinations.set(d));
  }
}
