import { Routes } from '@angular/router';

import { SidemenuLayout } from '@shared/layouts/sidemenu-layout/sidemenu-layout';

export const authRoutes: Routes = [
  {
    path: '',
    component: SidemenuLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard-page/dashboard-page'),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard-page/dashboard-page'),
      },
      {
        path: 'all-users',
        loadComponent: () => import('./pages/all-users-page/all-users-page'),
      },
      {
        path: 'pending',
        loadComponent: () => import('./pages/pending-page/pending-page'),
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/messages-page/messages-page'),
      },
      {
        path: 'message/:id',
        loadComponent: () => import('./pages/message-page/message-page'),
      },
    ],
  },
];

export default authRoutes;
