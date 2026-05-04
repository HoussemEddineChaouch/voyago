import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Voyage } from '../../models/voyage';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-voyage-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './voyage-card.component.html',
})
export class VoyageCardComponent {
  @Input() voyage!: Voyage;
  apiUrl = environment.apiUrl.replace('/api', ''); // base URL for images

  get imageUrl() {
    return this.voyage.image?.startsWith('http')
      ? this.voyage.image
      : `${this.apiUrl}/uploads/${this.voyage.image}`;
  }
}
