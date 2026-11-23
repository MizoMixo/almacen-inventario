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
    { codigo: 'MAT-006', nombre: 'Guantes de seguridad nitrilo', unidad: 'par' },
  ];

  stock: StockPorAlmacen = {
    'Almacén Central': { 'MAT-001': 45, 'MAT-002': 2, 'MAT-003': 15, 'MAT-004': 3, 'MAT-005': 8 },
    'Almacén Campo': { 'MAT-001': 10, 'MAT-002': 2, 'MAT-005': 5 },
    'Almacén Vichama': { 'MAT-003': 25, 'MAT-004': 6 },
  };

  stockMinimo: Record<string, number> = {
    'MAT-001': 10,
    'MAT-002': 5,
    'MAT-003': 50,
    'MAT-004': 10,
    'MAT-005': 4,
    'MAT-006': 20,
  };

  stockEn(almacen: string, codigo: string): number {
    return this.stock[almacen]?.[codigo] ?? 0;
  }

  // Ingresos
  motivosIngreso = ['Compra', 'Donación', 'Devolución'];
  tiposDocumentoIngreso = [
    'Factura',
    'Boleta',
    'Guía de remisión',
    'Orden de compra',
    'Acta de donación',
  ];

  // Salidas
  motivosSalida = ['Consumo', 'Entrega a personal o área', 'Baja o merma', 'Donación'];
  tiposDocumentoSalida = ['Requerimiento', 'Guía de remisión', 'Acta de entrega', 'Vale de salida'];
  areas = ['Conservación', 'Mantenimiento', 'Administración'];
  receptores = ['Luis Rojas', 'María Quispe', 'Carlos Vega'];

  // Transferencias
  motivosTransferencia = [
    'Abastecimiento de obra / sede',
    'Reubicación',
    'Devolución a almacén central',
  ];
  tiposDocumentoTransferencia = ['Guía de remisión', 'Guía interna', 'Acta de entrega'];

  // Ajustes de inventario
  tipoAjusteGeneral = 'Inventario general trimestral';
  tiposAjuste = [
    'Regularización por diferencia física',
    'Carga de stock inicial',
    this.tipoAjusteGeneral,
  ];
}
