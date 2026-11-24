import { Injectable, inject } from '@angular/core';
import { Movimiento, Operacion, TipoMovimiento, TipoOperacion } from '@shared/models/inventario';
import { Catalogos } from '@shared/services/catalogos';

// Datos de ejemplo. Con el backend, esta clase pedirá las operaciones a la API.
@Injectable({ providedIn: 'root' })
export class Operaciones {
  private catalogos = inject(Catalogos);

  // Arma un movimiento tomando el nombre y la unidad del catálogo
  private m(codigo: string, almacen: string, tipo: TipoMovimiento, cantidad: number): Movimiento {
    const mat = this.catalogos.materiales.find((x) => x.codigo === codigo)!;
    return { codigo, material: mat.nombre, unidad: mat.unidad, almacen, tipo, cantidad };
  }

  private datos: Operacion[] = [
    {
      id: 135,
      tipo: 'INGRESO',
      fecha: '2026-11-20',
      documento: 'Factura F001-000125',
      motivo: 'Compra',
      registradoPor: 'Rony Castro',
      observaciones: 'Compra de materiales para mantenimiento.',
      movimientos: [
        this.m('MAT-001', 'Almacén Central', 'AUMENTO', 25),
        this.m('MAT-002', 'Almacén Central', 'AUMENTO', 10),
        this.m('MAT-003', 'Almacén Central', 'AUMENTO', 100),
        this.m('MAT-004', 'Almacén Central', 'AUMENTO', 20),
        this.m('MAT-005', 'Almacén Central', 'AUMENTO', 6),
      ],
    },
    {
      id: 134,
      tipo: 'INGRESO',
      fecha: '2026-11-18',
      documento: 'Guía de remisión 001-0452',
      motivo: 'Compra',
      registradoPor: 'Ana Torres',
      observaciones: '',
      movimientos: [
        this.m('MAT-004', 'Almacén Central', 'AUMENTO', 30),
        this.m('MAT-003', 'Almacén Central', 'AUMENTO', 50),
      ],
    },
    {
      id: 133,
      tipo: 'INGRESO',
      fecha: '2026-11-12',
      documento: '',
      motivo: 'Donación',
      registradoPor: 'Rony Castro',
      observaciones: 'Registro sin documento de respaldo.',
      movimientos: [this.m('MAT-005', 'Almacén Campo', 'AUMENTO', 5)],
    },
    {
      id: 231,
      tipo: 'SALIDA',
      fecha: '2026-11-19',
      documento: 'Requerimiento 089',
      motivo: 'Consumo',
      registradoPor: 'Rony Castro',
      observaciones: '',
      area: 'Mantenimiento',
      receptor: 'Luis Rojas',
      movimientos: [
        this.m('MAT-002', 'Almacén Campo', 'DISMINUCION', 2),
        this.m('MAT-001', 'Almacén Campo', 'DISMINUCION', 4),
        this.m('MAT-005', 'Almacén Campo', 'DISMINUCION', 1),
      ],
    },
    {
      id: 230,
      tipo: 'SALIDA',
      fecha: '2026-11-17',
      documento: 'Requerimiento 088',
      motivo: 'Entrega a personal o área',
      registradoPor: 'Ana Torres',
      observaciones: '',
      area: 'Conservación',
      receptor: 'María Quispe',
      movimientos: [
        this.m('MAT-001', 'Almacén Central', 'DISMINUCION', 5),
        this.m('MAT-004', 'Almacén Central', 'DISMINUCION', 3),
      ],
    },
    {
      id: 229,
      tipo: 'SALIDA',
      fecha: '2026-11-11',
      documento: '',
      motivo: 'Baja o merma',
      registradoPor: 'Rony Castro',
      observaciones: 'Material deteriorado en almacén.',
      movimientos: [this.m('MAT-003', 'Almacén Central', 'DISMINUCION', 10)],
    },
    {
      id: 34,
      tipo: 'TRANSFERENCIA',
      fecha: '2026-11-18',
      documento: 'Guía interna 018',
      motivo: 'Abastecimiento de obra / sede',
      registradoPor: 'Rony Castro',
      observaciones: '',
      movimientos: [
        this.m('MAT-003', 'Almacén Central', 'DISMINUCION', 20),
        this.m('MAT-003', 'Almacén Vichama', 'AUMENTO', 20),
        this.m('MAT-004', 'Almacén Central', 'DISMINUCION', 6),
        this.m('MAT-004', 'Almacén Vichama', 'AUMENTO', 6),
      ],
    },
    {
      id: 33,
      tipo: 'TRANSFERENCIA',
      fecha: '2026-11-14',
      documento: 'Acta de entrega 009',
      motivo: 'Reubicación',
      registradoPor: 'Ana Torres',
      observaciones: '',
      movimientos: [
        this.m('MAT-001', 'Almacén Central', 'DISMINUCION', 10),
        this.m('MAT-001', 'Almacén Campo', 'AUMENTO', 10),
        this.m('MAT-005', 'Almacén Central', 'DISMINUCION', 3),
        this.m('MAT-005', 'Almacén Campo', 'AUMENTO', 3),
      ],
    },
    {
      id: 32,
      tipo: 'TRANSFERENCIA',
      fecha: '2026-11-09',
      documento: '',
      motivo: 'Devolución a almacén central',
      registradoPor: 'Rony Castro',
      observaciones: '',
      movimientos: [
        this.m('MAT-002', 'Almacén Campo', 'DISMINUCION', 2),
        this.m('MAT-002', 'Almacén Central', 'AUMENTO', 2),
      ],
    },
    {
      id: 12,
      tipo: 'AJUSTE',
      fecha: '2026-11-15',
      documento: 'ACTA-014',
      motivo: 'Regularización por diferencia física',
      registradoPor: 'Rony Castro',
      observaciones: 'Conteo físico supervisado por Administración.',
      movimientos: [this.m('MAT-001', 'Almacén Central', 'DISMINUCION', 1)],
    },
    {
      id: 11,
      tipo: 'AJUSTE',
      fecha: '2026-10-01',
      documento: 'INV-Q3-2026',
      motivo: 'Inventario general trimestral',
      registradoPor: 'Ana Torres',
      observaciones: 'Conteo general del tercer trimestre.',
      movimientos: [
        this.m('MAT-001', 'Almacén Campo', 'AUMENTO', 2),
        this.m('MAT-002', 'Almacén Campo', 'DISMINUCION', 1),
        this.m('MAT-005', 'Almacén Campo', 'AUMENTO', 1),
      ],
    },
  ];

  // Más recientes primero
  todas(): Operacion[] {
    return [...this.datos].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  }

  porTipo(tipo: TipoOperacion): Operacion[] {
    return this.todas().filter((o) => o.tipo === tipo);
  }

  ultimas(cantidad: number): Operacion[] {
    return this.todas().slice(0, cantidad);
  }
}
