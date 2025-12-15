import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes'),
  },
  {
    path: 'doctor',
    canActivate: [authGuard],
    loadChildren: () => import('./features/doctor/doctor.routes'),
  },
  {
    path: 'patient',
    canActivate: [authGuard],
    loadChildren: () => import('./features/patient/patient.routes'),
  },
  {
    path: 'update-user',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@shared/pages/update-user-page/update-user-page'),
  },
  {
    path: 'user-details/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@shared/pages/user-details-page/user-details-page'),
  },
  {
    path: '**',
    loadChildren: () => import('./features/home/home.routes'),
  },
];
