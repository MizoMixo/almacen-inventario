import { Component, computed, inject, signal } from '@angular/core';
import { Catalogos } from '@shared/services/catalogos';
import { FormsModule } from '@angular/forms';
import {
  LucidePackage,
  LucideCircleCheck,
  LucideTriangleExclamationPoint,
  LucideCircleX,
  LucideSearch,
} from '@lucide/angular';

type Estado = 'normal' | 'bajo' | 'agotado';

interface Material {
  codigo: string;
  nombre: string;
  unidad: string;
  minimo: number; // stock mínimo del material
  stock: Record<string, number>; // stock por almacén
}

@Component({
  selector: 'app-consultar-stock',
  imports: [
    FormsModule,
    LucidePackage,
    LucideCircleCheck,
    LucideTriangleExclamationPoint,
    LucideCircleX,
    LucideSearch,
  ],
  templateUrl: './consultar-stock.html',
  styleUrl: './consultar-stock.css',
})
export class ConsultarStock {
  // Datos de ejemplo (luego vendrán de la base de datos)
  private catalogos = inject(Catalogos);

  almacenes = this.catalogos.almacenes;

  // Combina los catálogos compartidos en el formato que usa esta pantalla
  materiales: Material[] = this.catalogos.materiales.map((m) => ({
    ...m,
    minimo: this.catalogos.stockMinimo[m.codigo] ?? 0,
    stock: Object.fromEntries(this.almacenes.map((a) => [a, this.catalogos.stockEn(a, m.codigo)])),
  }));

  // Filtros
  busqueda = signal('');
  almacen = signal('');
  estado = signal<'' | Estado>('');

  // Textos y colores por estado
  etiquetas: Record<Estado, string> = { normal: 'Normal', bajo: 'Stock bajo', agotado: 'Agotado' };
  chip: Record<Estado, string> = {
    normal: 'bg-emerald-100 text-emerald-700',
    bajo: 'bg-amber-100 text-amber-700',
    agotado: 'bg-rose-100 text-rose-700',
  };
  barra: Record<Estado, string> = {
    normal: 'bg-emerald-500',
    bajo: 'bg-amber-500',
    agotado: 'bg-rose-500',
  };

  private stockDe(m: Material, almacen: string): number {
    return almacen ? (m.stock[almacen] ?? 0) : Object.values(m.stock).reduce((a, b) => a + b, 0);
  }

  private estadoDe(stock: number, minimo: number): Estado {
    if (stock <= 0) return 'agotado';
    if (stock <= minimo) return 'bajo';
    return 'normal';
  }

  // Materiales según buscador y almacén (todavía sin filtrar por estado)
  private base = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const alm = this.almacen();
    return this.materiales
      .filter(
        (m) => m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto),
      )
      .map((m) => {
        const total = this.stockDe(m, alm);
        return {
          m,
          total,
          estado: this.estadoDe(total, m.minimo),
          desglose: (alm ? [alm] : this.almacenes).map((a) => ({
            almacen: a.replace('Almacén ', ''),
            cantidad: m.stock[a] ?? 0,
          })),
        };
      });
  });

  // Números de las tarjetas
  conteo = computed(() => {
    const b = this.base();
    return {
      total: b.length,
      normal: b.filter((f) => f.estado === 'normal').length,
      bajo: b.filter((f) => f.estado === 'bajo').length,
      agotado: b.filter((f) => f.estado === 'agotado').length,
    };
  });

  // Filas de la tabla (aplica también el filtro de estado)
  filas = computed(() => {
    const e = this.estado();
    return e ? this.base().filter((f) => f.estado === e) : this.base();
  });

  titulo = computed(() =>
    this.almacen() ? 'Existencias en ' + this.almacen() : 'Existencias consolidadas en empresa',
  );

  alternarEstado(e: Estado) {
    this.estado.update((actual) => (actual === e ? '' : e));
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.almacen.set('');
    this.estado.set('');
  }

  // Barra de progreso: el mínimo queda en el punto medio de la barra
  porcentaje(total: number, minimo: number): number {
    const referencia = minimo * 2;
    if (referencia <= 0) return total > 0 ? 100 : 0;
    return Math.min(100, Math.round((total / referencia) * 100));
  }
}
