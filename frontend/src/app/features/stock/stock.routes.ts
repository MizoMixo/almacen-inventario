import { Routes } from '@angular/router';

export const STOCK_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/consultar-stock/consultar-stock').then((m) => m.ConsultarStock),
  },
];
