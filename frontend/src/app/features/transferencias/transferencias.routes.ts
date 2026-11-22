import { Routes } from '@angular/router';

export const TRANSFERENCIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/transferencias/transferencias').then((m) => m.Transferencias),
  },
  {
    path: 'nueva',
    loadComponent: () =>
      import('./pages/nueva-transferencia/nueva-transferencia').then((m) => m.NuevaTransferencia),
  },
];
