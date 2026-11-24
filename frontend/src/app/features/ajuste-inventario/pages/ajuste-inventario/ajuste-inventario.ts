import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideBoxes, LucideClipboardList, LucidePlus } from '@lucide/angular';
import { Operacion } from '@shared/models/inventario';
import { Operaciones } from '@shared/services/operaciones';
import { FilaOperacion } from '@shared/components/fila-operacion/fila-operacion';
import { DetalleOperacion } from '@shared/components/detalle-operacion/detalle-operacion';

@Component({
  selector: 'app-ajuste-inventario',
  imports: [
    RouterLink,
    LucideBoxes,
    LucideClipboardList,
    LucidePlus,
    FilaOperacion,
    DetalleOperacion,
  ],
  templateUrl: './ajuste-inventario.html',
  styleUrl: './ajuste-inventario.css',
})
export class AjusteInventario {
  ajustes = inject(Operaciones).porTipo('AJUSTE').slice(0, 10);
  seleccionada = signal<Operacion | null>(null);
}
