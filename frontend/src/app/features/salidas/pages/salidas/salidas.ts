import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Operacion } from '@shared/models/inventario';
import { Operaciones } from '@shared/services/operaciones';
import { FilaOperacion } from '@shared/components/fila-operacion/fila-operacion';
import { DetalleOperacion } from '@shared/components/detalle-operacion/detalle-operacion';

@Component({
  selector: 'app-salidas',
  imports: [RouterLink, FilaOperacion, DetalleOperacion],
  templateUrl: './salidas.html',
  styleUrl: './salidas.css',
})
export class Salidas {
  salidas = inject(Operaciones).porTipo('SALIDA').slice(0, 10);
  seleccionada = signal<Operacion | null>(null);
}
