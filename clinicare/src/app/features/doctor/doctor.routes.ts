import { Routes } from '@angular/router';
import { SidemenuLayout } from '@shared/layouts/sidemenu-layout/sidemenu-layout';

export const doctorRoutes: Routes = [
  // Rutas sin layout
  {
    path: 'complete-registration',
    loadComponent: () =>
      import(
        './pages/doctor-complete-registration-page/doctor-complete-registration-page'
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
        path: 'today-appointments',
        loadComponent: () =>
          import('./pages/today-appointments-page/today-appointments-page'),
      },
      {
        path: 'agenda',
        loadComponent: () => import('./pages/agenda-page/agenda-page'),
      },
      {
        path: 'appointment-details/:id',
        loadComponent: () =>
          import(
            '@shared/pages/appointment-details-page/appointment-details-page'
          ),
      },
      {
        path: 'patient/history/:id',
        loadComponent: () =>
          import(
            './pages/patient-medical-history-page/patient-medical-history-page'
          ),
      },
    ],
  },
];

export default doctorRoutes;
