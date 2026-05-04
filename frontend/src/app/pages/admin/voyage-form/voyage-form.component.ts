import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AdminService } from '../../../services/admin.service';
import { VoyageService } from '../../../services/voyage.service';
import { DestinationService } from '../../../services/destination.service';
import { Destination } from '../../../models/destination';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-voyage-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './voyage-form.component.html',
})
export class VoyageFormComponent implements OnInit {
  private adminService = inject(AdminService);
  private voyageService = inject(VoyageService);
  private destService = inject(DestinationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  editId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  destinations = signal<Destination[]>([]);
  apiBase = environment.apiUrl.replace('/api', '');

  // Form fields
  title = signal('');
  slug = signal('');
  description = signal('');
  price = signal<number | null>(null);
  duration = signal<number | null>(null);
  date = signal('');
  destinationId = signal('');
  spotsLeft = signal<number | null>(null);
  rating = signal<number | null>(null);
  reviewCount = signal<number | null>(null);
  featured = signal(false);
  includes = signal(''); // comma-separated input
  existingImage = signal(''); // current image filename from server
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  ngOnInit() {
    this.destService.getAll().subscribe((d) => this.destinations.set(d));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(id);
      this.loading.set(true);
      // Load voyage by id
      this.voyageService.getAll({ limit: 200 }).subscribe((res) => {
        const v = res.voyages.find((x) => x._id === id);
        if (v) {
          this.title.set(v.title);
          this.slug.set(v.slug);
          this.description.set(v.description ?? '');
          this.price.set(v.price);
          this.duration.set(v.duration);
          this.date.set(v.date ? v.date.slice(0, 10) : '');
          this.destinationId.set((v.destination as any)?._id ?? '');
          this.spotsLeft.set(v.spotsLeft);
          this.rating.set(v.rating);
          this.reviewCount.set(v.reviewCount);
          this.featured.set(v.featured);
          this.includes.set((v.includes ?? []).join(', '));
          this.existingImage.set(v.image ?? '');
        }
        this.loading.set(false);
      });
    }
  }

  get currentImageUrl() {
    if (this.previewUrl()) return this.previewUrl()!;
    const img = this.existingImage();
    if (!img) return null;
    return img.startsWith('http') ? img : `${this.apiBase}/uploads/${img}`;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  autoSlug() {
    this.slug.set(
      this.title()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    );
  }

  submit() {
    if (!this.title() || !this.price() || !this.destinationId()) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    const fd = new FormData();
    fd.append('title', this.title());
    fd.append('slug', this.slug());
    fd.append('description', this.description());
    fd.append('price', String(this.price()));
    fd.append('duration', String(this.duration()));
    fd.append('date', this.date());
    fd.append('destination', this.destinationId());
    fd.append('spotsLeft', String(this.spotsLeft()));
    fd.append('rating', String(this.rating()));
    fd.append('reviewCount', String(this.reviewCount()));
    fd.append('featured', String(this.featured()));

    const includesArr = this.includes()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    includesArr.forEach((item) => fd.append('includes[]', item));

    if (this.selectedFile()) {
      fd.append('image', this.selectedFile()!);
    }

    this.saving.set(true);
    this.error.set('');

    const call = this.isEdit()
      ? this.adminService.updateVoyage(this.editId()!, fd)
      : this.adminService.createVoyage(fd);

    call.subscribe({
      next: () =>
        this.router.navigate(['/admin'], { queryParams: { tab: 'voyages' } }),
      error: (e) => {
        this.error.set(e.error?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }
}
