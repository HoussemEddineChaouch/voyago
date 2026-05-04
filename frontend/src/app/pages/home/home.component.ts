import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VoyageCardComponent } from '../../components/voyage-card/voyage-card.component';
import { VoyageService } from '../../services/voyage.service';
import { Voyage } from '../../models/voyage';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    VoyageCardComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private voyageService = inject(VoyageService);
  featured = signal<Voyage[]>([]);

  ngOnInit() {
    this.voyageService.getAll({ featured: true, limit: 4 }).subscribe((res) => {
      this.featured.set(res.voyages);
    });
  }
}
