import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideDynamicIcon,
  LucideWarehouse,
  LucideLogOut,
  LucideHouse,
  LucidePackagePlus,
  LucidePackageMinus,
  LucideArrowLeftRight,
  LucideClipboardCheck,
  LucideBoxes,
  LucideRotateCcwClock,
  LucideFileText,
  LucideSettings,
} from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideDynamicIcon,
    LucideWarehouse,
    LucideLogOut,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  //OPERACIONES MENU LATERAL

  readonly grupos = [
    { titulo: '', items: [{ texto: 'INICIO', ruta: '/inicio', icono: LucideHouse }] },
    {
      titulo: 'Operaciones Almacén',
      items: [
        { texto: 'ENTRADAS', ruta: '/entradas', icono: LucidePackagePlus },
        { texto: 'SALIDAS', ruta: '/salidas', icono: LucidePackageMinus },
        { texto: 'TRANSFERENCIAS', ruta: '/transferencias', icono: LucideArrowLeftRight },
        { texto: 'AJUSTE DE INVENTARIO', ruta: '/ajuste-inventario', icono: LucideClipboardCheck },
      ],
    },
    {
      titulo: 'Consulta y Administración',
      items: [
        { texto: 'CONSULTAR STOCK', ruta: '/stock', icono: LucideBoxes },
        { texto: 'HISTORIAL DE OPERACIONES', ruta: '/historial', icono: LucideRotateCcwClock },
        { texto: 'REPORTES', ruta: '/reportes', icono: LucideFileText },
        { texto: 'AJUSTES', ruta: '/ajustes', icono: LucideSettings },
      ],
    },
  ];
}
