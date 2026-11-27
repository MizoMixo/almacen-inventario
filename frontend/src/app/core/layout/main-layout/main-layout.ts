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
import { Sesion } from '@core/auth/sesion';
import { Auth } from '@core/auth/auth';

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
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideDynamicIcon,
    LucideWarehouse,
    LucideLogOut,
    LucideMenu,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private router = inject(Router);
  sesion = inject(Sesion);
  private auth = inject(Auth);

  constructor() {
    // Refresca los datos del usuario desde la API; si el token venció, el interceptor cierra la sesión
    this.auth.perfil().subscribe({ error: () => {} });
  }

  salir() {
    this.sesion.cerrar();
    this.router.navigate(['/login']);
  }

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

  // Para el breadcrumb: la dirección actual
  private url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  private todos = this.grupos.flatMap((g) => g.items);

  // Sección actual del menú
  seccion = computed(() => this.todos.find((i) => this.url().startsWith(i.ruta)) ?? this.todos[0]);

  private subpaginas: Record<string, string> = {
    '/entradas/nuevo': 'Nuevo ingreso',
    '/salidas/nueva': 'Nueva salida',
    '/transferencias/nueva': 'Nueva transferencia',
    '/ajuste-inventario/nuevo': 'Nuevo ajuste',
  };
  subpagina = computed(() => this.subpaginas[this.url().split('?')[0]] ?? '');
}
