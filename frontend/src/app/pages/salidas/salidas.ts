import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-salidas',
  imports: [RouterLink, LucidePlus],
  templateUrl: './salidas.html',
  styleUrl: './salidas.css',
})
export class Salidas {
  salidas = [
    { numero: 231, fecha: '2026-11-02', almacen: 'Almacén Campo', materiales: 3, documento: 'Req. N.º 089' },
    { numero: 230, fecha: '2026-11-02', almacen: 'Almacén Central', materiales: 2, documento: 'Req. N.º 088' },
    { numero: 229, fecha: '2026-11-01', almacen: 'Almacén Central', materiales: 1, documento: '' },
  ];
}
