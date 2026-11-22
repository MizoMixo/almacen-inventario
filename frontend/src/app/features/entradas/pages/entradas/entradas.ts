import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-entradas',
  imports: [RouterLink, LucidePlus],
  templateUrl: './entradas.html',
  styleUrl: './entradas.css',
})
export class Entradas {
  ingresos = [
    { numero: 135, fecha: '2026-11-02', almacen: 'Almacén Central', materiales: 5, documento: 'Factura 000125' },
    { numero: 134, fecha: '2026-11-02', almacen: 'Almacén Central', materiales: 2, documento: 'GRR 001-0452' },
    { numero: 133, fecha: '2026-11-01', almacen: 'Almacén Campo', materiales: 1, documento: '' },
  ];
}
