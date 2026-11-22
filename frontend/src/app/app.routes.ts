import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadChildren: () => import('./features/inicio/inicio.routes').then((m) => m.INICIO_ROUTES),
      },
      {
        path: 'entradas',
        loadChildren: () =>
          import('./features/entradas/entradas.routes').then((m) => m.ENTRADAS_ROUTES),
      },
      {
        path: 'salidas',
        loadChildren: () =>
          import('./features/salidas/salidas.routes').then((m) => m.SALIDAS_ROUTES),
      },
      {
        path: 'transferencias',
        loadChildren: () =>
          import('./features/transferencias/transferencias.routes').then(
            (m) => m.TRANSFERENCIAS_ROUTES,
          ),
      },
      {
        path: 'ajuste-inventario',
        loadChildren: () =>
          import('./features/ajuste-inventario/ajuste-inventario.routes').then(
            (m) => m.AJUSTE_INVENTARIO_ROUTES,
          ),
      },
      {
        path: 'stock',
        loadChildren: () => import('./features/stock/stock.routes').then((m) => m.STOCK_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
