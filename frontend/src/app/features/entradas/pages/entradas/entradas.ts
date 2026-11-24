import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Operacion } from '@shared/models/inventario';
import { Operaciones } from '@shared/services/operaciones';
import { FilaOperacion } from '@shared/components/fila-operacion/fila-operacion';
import { DetalleOperacion } from '@shared/components/detalle-operacion/detalle-operacion';

@Component({
  selector: 'app-entradas',
  imports: [RouterLink, FilaOperacion, DetalleOperacion],
  templateUrl: './entradas.html',
  styleUrl: './entradas.css',
})
export class Entradas {
  ingresos = inject(Operaciones).porTipo('INGRESO').slice(0, 10);
  seleccionada = signal<Operacion | null>(null);
}
