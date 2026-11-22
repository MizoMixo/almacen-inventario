import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acciones-formulario',
  imports: [RouterLink],
  templateUrl: './acciones-formulario.html',
  styleUrl: './acciones-formulario.css',
})
export class AccionesFormulario {
  guardado = input(false);
  error = input('');
  rutaVolver = input.required<string>();
  textoGuardar = input.required<string>();
  textoVolver = input.required<string>();
  textoNuevo = input.required<string>();

  guardar = output<void>();
  nuevo = output<void>();
}
