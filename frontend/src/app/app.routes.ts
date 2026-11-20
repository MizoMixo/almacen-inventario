import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Entradas } from './pages/entradas/entradas';
import { NuevoIngreso } from './pages/nuevo-ingreso/nuevo-ingreso';
import { Salidas } from './pages/salidas/salidas';
import { NuevaSalida } from './pages/nueva-salida/nueva-salida';
import { Transferencias } from './pages/transferencias/transferencias';
import { NuevaTransferencia } from './pages/nueva-transferencia/nueva-transferencia';
import { AjusteInventario } from './pages/ajuste-inventario/ajuste-inventario';
import { NuevoAjuste } from './pages/nuevo-ajuste/nuevo-ajuste';
import { ConsultarStock } from './pages/consultar-stock/consultar-stock';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'entradas', component:  Entradas},
  { path: 'entradas/nuevo', component: NuevoIngreso },
  { path: 'salidas', component: Salidas },
  { path: 'salidas/nueva', component: NuevaSalida },
  { path: 'transferencias', component: Transferencias },
  { path: 'transferencias/nueva', component: NuevaTransferencia },
  { path: 'ajuste-inventario', component: AjusteInventario },
  { path: 'ajuste-inventario/nuevo', component: NuevoAjuste },
  { path: 'stock', component: ConsultarStock },
  { path: '**', redirectTo: 'inicio' },

];
