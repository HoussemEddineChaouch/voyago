import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AdminService } from '../../../services/admin.service';
import { DestinationService } from '../../../services/destination.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './destination-form.component.html',
})
export class DestinationFormComponent implements OnInit {
  private adminService = inject(AdminService);
  private destService = inject(DestinationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  editId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  apiBase = environment.apiUrl.replace('/api', '');

  // Form fields
  name = signal('');
  slug = signal('');
  description = signal('');
  existingImage = signal('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(id);
      this.loading.set(true);
      this.destService.getAll().subscribe((ds) => {
        const d = ds.find((x) => x._id === id);
        if (d) {
          this.name.set(d.name);
          this.slug.set(d.slug);
          this.description.set(d.description ?? '');
          this.existingImage.set(d.image ?? '');
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
      this.name()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    );
  }

  submit() {
    if (!this.name() || !this.slug()) {
      this.error.set('Name and slug are required.');
      return;
    }

    const fd = new FormData();
    fd.append('name', this.name());
    fd.append('slug', this.slug());
    fd.append('description', this.description());
    if (this.selectedFile()) {
      fd.append('image', this.selectedFile()!);
    }

    this.saving.set(true);
    this.error.set('');

    const call = this.isEdit()
      ? this.adminService.updateDestination(this.editId()!, fd)
      : this.adminService.createDestination(fd);

    call.subscribe({
      next: () =>
        this.router.navigate(['/admin'], {
          queryParams: { tab: 'destinations' },
        }),
      error: (e) => {
        this.error.set(e.error?.message ?? 'Save failed');
        this.saving.set(false);
      },
    });
  }
}
