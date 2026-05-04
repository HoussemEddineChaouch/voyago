import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard'; // ← ADD

export const routes: Routes = [
  // ── Existing public routes ──────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'voyages',
    loadComponent: () =>
      import('./pages/voyages/voyages.component').then(
        (m) => m.VoyagesComponent,
      ),
  },
  {
    path: 'voyages/:slug',
    loadComponent: () =>
      import('./pages/voyage-detail/voyage-detail.component').then(
        (m) => m.VoyageDetailComponent,
      ),
  },
  {
    path: 'destinations',
    loadComponent: () =>
      import('./pages/destinations/destinations.component').then(
        (m) => m.DestinationsComponent,
      ),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'auth/google-callback',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'booking/:slug',
    loadComponent: () =>
      import('./pages/booking/booking.component').then(
        (m) => m.BookingComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [authGuard],
  },

  // ── Admin routes ────────────────────────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/voyages/new',
    loadComponent: () =>
      import('./pages/admin/voyage-form/voyage-form.component').then(
        (m) => m.VoyageFormComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/voyages/edit/:id',
    loadComponent: () =>
      import('./pages/admin/voyage-form/voyage-form.component').then(
        (m) => m.VoyageFormComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/destinations/new',
    loadComponent: () =>
      import('./pages/admin/destination-form/destination-form.component').then(
        (m) => m.DestinationFormComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/destinations/edit/:id',
    loadComponent: () =>
      import('./pages/admin/destination-form/destination-form.component').then(
        (m) => m.DestinationFormComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./pages/edit-profile/edit-profile.component').then(
        (m) => m.EditProfileComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'bookings/:id',
    loadComponent: () =>
      import('./pages/booking-detail/booking-detail.component').then(
        (m) => m.BookingDetailComponent,
      ),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' },
];
