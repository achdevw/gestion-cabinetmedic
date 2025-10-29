import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'medecin',
    loadComponent: () => import('./components/medecin.component').then(m => m.MedecinComponent),
    canActivate: [roleGuard],
    data: { roles: ['medecin'] }
  },
  {
    path: 'medicalrecords',
    loadComponent: () => import('./components/admin/MedicalRecordsComponent').then(m => m.MedicalRecordsComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'appointments',
    loadComponent: () => import('./components/admin/appointment.component').then(m => m.AppointmentComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'patient',
    loadComponent: () => import('./components/patient.component').then(m => m.PatientComponent),
    canActivate: [roleGuard],
    data: { roles: ['patient'] }
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'admin/user/create',
    loadComponent: () => import('./components/user-form.component').then(m => m.UserFormComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/user/edit/:id',
    loadComponent: () => import('./components/user-form.component').then(m => m.UserFormComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'notifications',
    loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [roleGuard],
    data: { roles: ['admin', 'medecin', 'patient'] }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'unauthorized'
  }
];
