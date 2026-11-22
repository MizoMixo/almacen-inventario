import { Routes } from '@angular/router';

export const ENTRADAS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/entradas/entradas').then((m) => m.Entradas) },
  {
    path: 'nuevo',
    loadComponent: () => import('./pages/nuevo-ingreso/nuevo-ingreso').then((m) => m.NuevoIngreso),
  },
];
