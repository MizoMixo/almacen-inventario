export interface Material {
  codigo: string;
  nombre: string;
  unidad: string;
}

// Stock por almacén y por código de material
export type StockPorAlmacen = Record<string, Record<string, number>>;

export type TipoOperacion = 'INGRESO' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE';
export type TipoMovimiento = 'AUMENTO' | 'DISMINUCION';

// Efecto de una operación sobre un material en un almacén
export interface Movimiento {
  codigo: string;
  material: string;
  unidad: string;
  almacen: string;
  tipo: TipoMovimiento;
  cantidad: number;
}

// Una operación agrupa varios movimientos
export interface Operacion {
  id: number;
  tipo: TipoOperacion;
  fecha: string;
  documento: string;
  motivo: string;
  registradoPor: string;
  observaciones: string;
  area?: string;
  receptor?: string;
  movimientos: Movimiento[];
}
