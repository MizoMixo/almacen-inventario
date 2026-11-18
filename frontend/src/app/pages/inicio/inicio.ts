import { Component } from '@angular/core';
import {
  LucidePackage,
  LucideWarehouse,
  LucideTriangleExclamationPoint,
  LucideArrowLeftRight,
} from '@lucide/angular';

@Component({
  selector: 'app-inicio',
  imports: [LucidePackage, LucideWarehouse, LucideTriangleExclamationPoint, LucideArrowLeftRight],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  movimientos = [
    {
      tipo: 'Ingreso',
      numero: 135,
      fecha: '2026-11-02',
      documento: 'Factura 000125',
      color: 'bg-green-500',
    },
    {
      tipo: 'Salida',
      numero: 231,
      fecha: '2026-11-02',
      documento: 'Factura 000125',
      color: 'bg-red-500',
    },
    {
      tipo: 'Ingreso',
      numero: 134,
      fecha: '2026-11-02',
      documento: 'Factura 000125',
      color: 'bg-green-500',
    },
    {
      tipo: 'Transferencia',
      numero: 34,
      fecha: '2026-11-02',
      documento: 'Factura 000125',
      color: 'bg-yellow-400',
    },
  ];
}
