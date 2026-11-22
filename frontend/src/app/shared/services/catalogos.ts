import { Injectable } from '@angular/core';
import { Material, StockPorAlmacen } from '@shared/models/inventario';

// Datos de ejemplo. Con el backend, esta clase los pedirá a la API en lugar de tenerlos escritos aquí.
@Injectable({ providedIn: 'root' })
export class Catalogos {
  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];

  materiales: Material[] = [
    { codigo: 'MAT-001', nombre: 'Cemento Portland Tipo I', unidad: 'bls' },
    { codigo: 'MAT-002', nombre: 'Brocha de cerda 2"', unidad: 'und' },
    { codigo: 'MAT-003', nombre: 'Bolsa polietileno 10x15', unidad: 'und' },
    { codigo: 'MAT-004', nombre: 'Tubo PVC SAP 1/2"', unidad: 'und' },
    { codigo: 'MAT-005', nombre: 'Pintura látex blanco 4L', unidad: 'gal' },
  ];

  // Lo usarán Salidas, Transferencias y Ajuste cuando los migremos
  stock: StockPorAlmacen = {
    'Almacén Central': { 'MAT-001': 45, 'MAT-002': 12, 'MAT-003': 15, 'MAT-004': 30, 'MAT-005': 8 },
    'Almacén Campo': { 'MAT-001': 10, 'MAT-002': 2, 'MAT-005': 5 },
    'Almacén Vichama': { 'MAT-003': 25, 'MAT-004': 6 },
  };

  // Catálogos de Ingresos
  motivosIngreso = ['Compra', 'Donación', 'Devolución'];
  tiposDocumentoIngreso = [
    'Factura',
    'Boleta',
    'Guía de remisión',
    'Orden de compra',
    'Acta de donación',
  ];
}
