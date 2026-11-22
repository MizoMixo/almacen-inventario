export interface Material {
  codigo: string;
  nombre: string;
  unidad: string;
}

// Stock por almacén y por código de material
export type StockPorAlmacen = Record<string, Record<string, number>>;
