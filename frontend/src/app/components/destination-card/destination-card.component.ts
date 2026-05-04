import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Destination } from '../../models/destination';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './destination-card.component.html',
})
export class DestinationCardComponent {
  @Input() destination!: Destination;
  apiUrl = environment.apiUrl.replace('/api', '');

  get imageUrl() {
    return this.destination.image?.startsWith('http')
      ? this.destination.image
      : `${this.apiUrl}/uploads/${this.destination.image}`;
  }
}
