import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeftRight, LucideBoxes } from '@lucide/angular';

@Component({
  selector: 'app-transferencias',
  imports: [RouterLink, LucideArrowLeftRight, LucideBoxes],
  templateUrl: './transferencias.html',
  styleUrl: './transferencias.css',
})
export class Transferencias {
  transferencias = [
    { numero: 34, fecha: '2026-11-18', origen: 'Almacén Central', destino: 'Almacén Vichama', materiales: 2, documento: 'Guía Int. 018' },
    { numero: 33, fecha: '2026-11-14', origen: 'Almacén Central', destino: 'Almacén Campo', materiales: 2, documento: 'Acta Entrega 009' },
    { numero: 32, fecha: '2026-11-09', origen: 'Almacén Campo', destino: 'Almacén Central', materiales: 1, documento: '' },
  ];
}
