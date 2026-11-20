import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucidePackage,
  LucideWarehouse,
  LucideTriangleExclamationPoint,
  LucideArrowLeftRight,
} from '@lucide/angular';

@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink,
    LucidePackage,
    LucideWarehouse,
    LucideTriangleExclamationPoint,
    LucideArrowLeftRight,
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  // Resalta la sección de stock crítico por un instante
  resaltado = signal(false);

  resumenMes = { total: 34, ingresos: 18, salidas: 14, otros: 2 };

  movimientos = [
    {
      tipo: 'Ingreso',
      numero: 135,
      fecha: '2026-11-02',
      documento: 'Factura 000125',
      almacen: 'Almacén Central',
      materiales: 5,
      color: 'bg-green-500',
    },
    {
      tipo: 'Salida',
      numero: 231,
      fecha: '2026-11-02',
      documento: 'Req. N.º 089',
      almacen: 'Almacén Campo',
      materiales: 3,
      color: 'bg-red-500',
    },
    {
      tipo: 'Ingreso',
      numero: 134,
      fecha: '2026-11-02',
      documento: 'GRR 001-0452',
      almacen: 'Almacén Central',
      materiales: 2,
      color: 'bg-green-500',
    },
    {
      tipo: 'Transferencia',
      numero: 34,
      fecha: '2026-11-02',
      documento: 'Guía Int. 018',
      almacen: 'Central → Vichama',
      materiales: 1,
      color: 'bg-yellow-400',
    },
  ];

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
