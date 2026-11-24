import { Operacion, TipoOperacion } from '@shared/models/inventario';

export const NOMBRE_TIPO: Record<TipoOperacion, string> = {
  INGRESO: 'Ingreso',
  SALIDA: 'Salida',
  TRANSFERENCIA: 'Transferencia',
  AJUSTE: 'Ajuste',
};

export const COLOR_BARRA: Record<TipoOperacion, string> = {
  INGRESO: 'bg-green-500',
  SALIDA: 'bg-red-500',
  TRANSFERENCIA: 'bg-yellow-400',
  AJUSTE: 'bg-purple-500',
};

export const COLOR_ETIQUETA: Record<TipoOperacion, string> = {
  INGRESO: 'bg-green-100 text-green-700',
  SALIDA: 'bg-red-100 text-red-700',
  TRANSFERENCIA: 'bg-yellow-100 text-yellow-800',
  AJUSTE: 'bg-purple-100 text-purple-700',
};

export function titulo(op: Operacion): string {
  return `${NOMBRE_TIPO[op.tipo]} N.º ${op.id}`;
}

// Un almacén, "Varios almacenes", o "Origen → Destino" en transferencias
export function resumenAlmacen(op: Operacion): string {
  if (op.tipo === 'TRANSFERENCIA') {
    const origen = op.movimientos.find((m) => m.tipo === 'DISMINUCION')?.almacen ?? '';
    const destino = op.movimientos.find((m) => m.tipo === 'AUMENTO')?.almacen ?? '';
    return `${origen} → ${destino}`;
  }
  const unicos = [...new Set(op.movimientos.map((m) => m.almacen))];
  return unicos.length === 1 ? unicos[0] : 'Varios almacenes';
}

// Materiales distintos (una transferencia tiene 2 movimientos por material)
export function cantidadMateriales(op: Operacion): number {
  return new Set(op.movimientos.map((m) => m.codigo)).size;
}

export function textoItems(op: Operacion): string {
  const n = cantidadMateriales(op);
  return `${n} ${n === 1 ? 'ítem' : 'ítems'}`;
}
