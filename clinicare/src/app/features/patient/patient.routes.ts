import { Routes } from '@angular/router';
import { SidemenuLayout } from '@shared/layouts/sidemenu-layout/sidemenu-layout';

export const patientRoutes: Routes = [
  // Rutas sin layout
  {
    path: 'complete-registration',
    loadComponent: () =>
      import(
        './pages/patient-complete-registration/patient-complete-registration'
      ),
  },

  // Rutas con layout
  {
    path: '',
    component: SidemenuLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard-page/dashboard-page'),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./pages/appointments-page/appointments-page'),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/medical-history-page/medical-history-page'),
      },
      {
        path: 'book-appointment',
        loadComponent: () =>
          import('./pages/book-appointment-page/book-appointment-page'),
      },
    ],
  },
];

export default patientRoutes;
