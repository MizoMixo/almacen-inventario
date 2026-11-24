import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucidePackage,
  LucideWarehouse,
  LucideTriangleExclamationPoint,
  LucideArrowLeftRight,
} from '@lucide/angular';
import { Operacion } from '@shared/models/inventario';
import { Operaciones } from '@shared/services/operaciones';
import { DetalleOperacion } from '@shared/components/detalle-operacion/detalle-operacion';
import { COLOR_BARRA, cantidadMateriales, resumenAlmacen, titulo } from '@shared/utils/operaciones';

@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink,
    DetalleOperacion,
    LucidePackage,
    LucideWarehouse,
    LucideTriangleExclamationPoint,
    LucideArrowLeftRight,
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private operaciones = inject(Operaciones);

  // Últimas operaciones y detalle de la seleccionada
  ultimos = this.operaciones.ultimas(5);
  seleccionada = signal<Operacion | null>(null);

  barra = COLOR_BARRA;
  titulo = titulo;
  almacen = resumenAlmacen;
  materiales = cantidadMateriales;

  // Resumen del mes actual, calculado con las operaciones
  resumenMes = this.calcularMes();

  private calcularMes() {
    const mes = new Date().toLocaleDateString('en-CA').slice(0, 7); // ej. 2026-11
    const delMes = this.operaciones.todas().filter((o) => o.fecha.startsWith(mes));
    const ingresos = delMes.filter((o) => o.tipo === 'INGRESO').length;
    const salidas = delMes.filter((o) => o.tipo === 'SALIDA').length;
    return { total: delMes.length, ingresos, salidas, otros: delMes.length - ingresos - salidas };
  }

  // Resalta la sección de stock crítico por un instante
  resaltado = signal(false);

  stockCritico = [
    {
      nombre: 'Cemento Portland Tipo I',
      almacen: 'Almacén Central',
      actual: 4,
      minimo: 10,
      unidad: 'bls',
    },
    { nombre: 'Brocha de cerda 2"', almacen: 'Almacén Campo', actual: 2, minimo: 5, unidad: 'und' },
    {
      nombre: 'Bolsa polietileno 10x15',
      almacen: 'Almacén Central',
      actual: 15,
      minimo: 50,
      unidad: 'und',
    },
  ];

  irAStockCritico(seccion: HTMLElement) {
    seccion.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.resaltado.set(true);
    setTimeout(() => this.resaltado.set(false), 1500);
  }
}
