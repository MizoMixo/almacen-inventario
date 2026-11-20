import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  LucideDynamicIcon,
  LucideWarehouse,
  LucideLogOut,
  LucideMenu,
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

// INTERFACES PARA EL MENU LATERAL
interface ItemMenu {
  texto: string;
  ruta: string;
  icono: any;
}

interface GrupoMenu {
  titulo: string;
  items: ItemMenu[];
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideDynamicIcon,
    LucideWarehouse,
    LucideLogOut,
    LucideMenu,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);

  // Menú desplegable en pantallas pequeñas
  menuAbierto = signal(false);
  alternarMenu() {
    this.menuAbierto.update((v) => !v);
  }
  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  //OPERACIONES MENU LATERAL
  readonly grupos: GrupoMenu[] = [
    { titulo: '', items: [{ texto: 'Inicio', ruta: '/inicio', icono: LucideHouse }] },
    {
      titulo: 'Operaciones Almacén',
      items: [
        { texto: 'Entradas', ruta: '/entradas', icono: LucidePackagePlus },
        { texto: 'Salidas', ruta: '/salidas', icono: LucidePackageMinus },
        { texto: 'Transferencias', ruta: '/transferencias', icono: LucideArrowLeftRight },
        { texto: 'Ajuste de inventario', ruta: '/ajuste-inventario', icono: LucideClipboardCheck },
      ],
    },
    {
      titulo: 'Consulta y Administración',
      items: [
        { texto: 'Consultar stock', ruta: '/stock', icono: LucideBoxes },
        { texto: 'Historial de operaciones', ruta: '/historial', icono: LucideRotateCcwClock },
        { texto: 'Reportes', ruta: '/reportes', icono: LucideFileText },
        { texto: 'Ajustes', ruta: '/ajustes', icono: LucideSettings },
      ],
    },
  ];

  // Para el breadcrumb: la dirección actual y el nombre de la página
  private url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  paginaActual = computed(() => {
    const url = this.url();
    const todos = this.grupos.flatMap((g) => g.items);
    return todos.find((i) => url.startsWith(i.ruta))?.texto ?? 'Inicio';
  });
}
