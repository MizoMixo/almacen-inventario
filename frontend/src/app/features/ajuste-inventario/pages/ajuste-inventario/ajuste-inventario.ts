import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideBoxes, LucideClipboardList, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-ajuste-inventario',
  imports: [RouterLink, LucideBoxes, LucideClipboardList, LucidePlus],
  templateUrl: './ajuste-inventario.html',
  styleUrl: './ajuste-inventario.css',
})
export class AjusteInventario {
  ajustes = [
    { numero: 12, fecha: '2026-11-15', almacen: 'Almacén Central', tipo: 'Regularización por diferencia física', materiales: 1, documento: 'ACTA-014' },
    { numero: 11, fecha: '2026-10-01', almacen: 'Almacén Campo', tipo: 'Inventario general trimestral', materiales: 3, documento: 'INV-Q3-2026' },
  ];
}
