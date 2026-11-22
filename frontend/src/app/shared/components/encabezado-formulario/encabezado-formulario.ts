import { Component, input } from '@angular/core';

@Component({
  selector: 'app-encabezado-formulario',
  templateUrl: './encabezado-formulario.html',
  styleUrl: './encabezado-formulario.css',
})
export class EncabezadoFormulario {
  titulo = input.required<string>();
  subtitulo = input('');
  guardado = input(false);
  mensajeGuardado = input('');
  etiquetaGuardado = input('Guardado · Solo lectura');
}
