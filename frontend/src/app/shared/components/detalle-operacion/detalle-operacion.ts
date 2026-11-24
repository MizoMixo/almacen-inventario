import { Component, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { Operacion } from '@shared/models/inventario';
import {
  COLOR_ETIQUETA,
  NOMBRE_TIPO,
  cantidadMateriales,
  resumenAlmacen,
  titulo,
} from '@shared/utils/operaciones';

@Component({
  selector: 'app-detalle-operacion',
  imports: [LucideX],
  templateUrl: './detalle-operacion.html',
  styleUrl: './detalle-operacion.css',
  host: { '(document:keydown.escape)': 'cerrar.emit()' }, // la tecla Esc también cierra
})
export class DetalleOperacion {
  operacion = input.required<Operacion>();
  cerrar = output<void>();

  etiqueta = COLOR_ETIQUETA;
  nombreTipo = NOMBRE_TIPO;
  titulo = titulo;
  almacen = resumenAlmacen;
  materiales = cantidadMateriales;
}
