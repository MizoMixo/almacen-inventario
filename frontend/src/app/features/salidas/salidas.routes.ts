import { Routes } from '@angular/router';

export const SALIDAS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/salidas/salidas').then((m) => m.Salidas) },
  {
    path: 'nueva',
    loadComponent: () => import('./pages/nueva-salida/nueva-salida').then((m) => m.NuevaSalida),
  },
];
