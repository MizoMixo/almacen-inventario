import { Routes } from '@angular/router';

export const AJUSTE_INVENTARIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ajuste-inventario/ajuste-inventario').then((m) => m.AjusteInventario),
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./pages/nuevo-ajuste/nuevo-ajuste').then((m) => m.NuevoAjuste),
  },
];
