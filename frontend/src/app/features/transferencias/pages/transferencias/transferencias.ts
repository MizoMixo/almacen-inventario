import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeftRight, LucideBoxes } from '@lucide/angular';
import { Operacion } from '@shared/models/inventario';
import { Operaciones } from '@shared/services/operaciones';
import { FilaOperacion } from '@shared/components/fila-operacion/fila-operacion';
import { DetalleOperacion } from '@shared/components/detalle-operacion/detalle-operacion';

@Component({
  selector: 'app-transferencias',
  imports: [RouterLink, LucideArrowLeftRight, LucideBoxes, FilaOperacion, DetalleOperacion],
  templateUrl: './transferencias.html',
  styleUrl: './transferencias.css',
})
export class Transferencias {
  transferencias = inject(Operaciones).porTipo('TRANSFERENCIA').slice(0, 10);
  seleccionada = signal<Operacion | null>(null);
}
