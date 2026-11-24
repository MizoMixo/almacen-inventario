import { Component, input, output } from '@angular/core';
import { Operacion } from '@shared/models/inventario';
import { COLOR_BARRA, resumenAlmacen, textoItems, titulo } from '@shared/utils/operaciones';

@Component({
  selector: 'app-fila-operacion',
  templateUrl: './fila-operacion.html',
  styleUrl: './fila-operacion.css',
  host: { class: 'block border-b border-slate-200 last:border-0' },
})
export class FilaOperacion {
  operacion = input.required<Operacion>();
  detalle = output<Operacion>();

  barra = COLOR_BARRA;
  titulo = titulo;
  almacen = resumenAlmacen;
  items = textoItems;
}
