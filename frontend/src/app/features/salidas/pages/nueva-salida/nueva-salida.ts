import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucidePlus, LucideTrash } from '@lucide/angular';
import { Sesion } from '@core/auth/sesion';
import { Material } from '@shared/models/inventario';
import { Catalogos } from '@shared/services/catalogos';
import { BuscadorMateriales } from '@shared/components/buscador-materiales/buscador-materiales';
import { EncabezadoFormulario } from '@shared/components/encabezado-formulario/encabezado-formulario';
import { AccionesFormulario } from '@shared/components/acciones-formulario/acciones-formulario';
import {
  claseCampo,
  claseCampoTabla,
  errorFecha,
  errorNumero,
  errorSerie,
  hoyISO,
  irAId,
  irAlPrimerError,
  limpiarNumero,
  limpiarSerie,
} from '@shared/utils/validaciones';

interface Linea {
  material: Material;
  almacen: string;
  cantidad: number | null;
}

@Component({
  selector: 'app-nueva-salida',
  imports: [
    FormsModule,
    LucidePlus,
    LucideTrash,
    BuscadorMateriales,
    EncabezadoFormulario,
    AccionesFormulario,
  ],
  templateUrl: './nueva-salida.html',
  styleUrl: './nueva-salida.css',
})
export class NuevaSalida {
  private sesion = inject(Sesion);
  private catalogos = inject(Catalogos);

  // Catálogos (vienen del servicio)
  motivos = this.catalogos.motivosSalida;
  tiposDocumento = this.catalogos.tiposDocumentoSalida;
  areas = this.catalogos.areas;
  receptores = this.catalogos.receptores;
  almacenes = this.catalogos.almacenes;
  materiales = this.catalogos.materiales;

  // Datos de la salida (la fecha empieza vacía)
  fecha = '';
  motivo = '';
  tipoDocumento = '';
  serie = '';
  numeroDocumento = '';
  area = '';
  receptor = '';
  observaciones = '';

  lineas = signal<Linea[]>([]);
  seleccionados = computed(() => this.lineas().map((l) => l.material.codigo));
  modalAbierto = signal(false);

  intentado = signal(false);
  error = signal('');
  guardado = signal(false);
  numeroGuardado = signal(0);
  private contador = 232; // número provisional; el real lo asignará el backend

  clase = claseCampo;
  claseLinea = claseCampoTabla;
  get hoy() {
    return hoyISO();
  }

  // ---------- Validaciones ----------
  vMotivo() {
    return this.motivo ? '' : 'Selecciona un motivo.';
  }
  vTipoDocumento() {
    return this.tipoDocumento ? '' : 'Selecciona el tipo de documento.';
  }
  vAlmacen(l: Linea) {
    return l.almacen ? '' : 'Elige almacén';
  }
  vCantidad(l: Linea) {
    return l.cantidad !== null && l.cantidad > 0 ? '' : 'Mayor que cero';
  }

  e(mensaje: string) {
    return this.intentado() ? mensaje : '';
  }

  errores() {
    return {
      fecha: this.e(errorFecha(this.fecha)),
      motivo: this.e(this.vMotivo()),
      tipoDocumento: this.e(this.vTipoDocumento()),
      serie: this.e(errorSerie(this.serie)),
      numero: this.e(errorNumero(this.numeroDocumento)),
      lineas: this.e(this.lineas().length === 0 ? 'Agrega al menos un material.' : ''),
    };
  }

  private formularioValido(): boolean {
    const lineas = this.lineas();
    return (
      !errorFecha(this.fecha) &&
      !this.vMotivo() &&
      !this.vTipoDocumento() &&
      !errorSerie(this.serie) &&
      !errorNumero(this.numeroDocumento) &&
      lineas.length > 0 &&
      lineas.every((l) => !this.vAlmacen(l) && !this.vCantidad(l))
    );
  }

  alEscribirSerie(ev: Event) {
    this.serie = limpiarSerie(ev);
  }
  alEscribirNumero(ev: Event) {
    this.numeroDocumento = limpiarNumero(ev);
  }

  // ---------- Materiales ----------
  abrirBuscador() {
    this.modalAbierto.set(true);
  }
  cerrarBuscador() {
    this.modalAbierto.set(false);
  }

  agregar(m: Material) {
    if (this.seleccionados().includes(m.codigo)) return;
    this.lineas.update((l) => [...l, { material: m, almacen: '', cantidad: null }]);
  }

  quitar(index: number) {
    this.lineas.update((l) => l.filter((_, i) => i !== index));
  }

  // ---------- Guardar ----------
  guardar() {
    if (this.guardado()) return;
    this.intentado.set(true);

    if (!this.formularioValido()) {
      this.error.set('Revisa los campos marcados en rojo.');
      irAlPrimerError();
      return;
    }
    this.error.set('');

    // Por ahora solo se muestra en la consola (F12). Con el backend, aquí se enviará.
    console.log('Salida lista para guardar:', {
      fecha: this.fecha,
      motivo: this.motivo,
      tipoDocumento: this.tipoDocumento,
      serie: this.serie,
      numeroDocumento: this.numeroDocumento,
      area: this.area,
      receptor: this.receptor,
      observaciones: this.observaciones,
      usuario: this.sesion.nombre,
      lineas: this.lineas(),
    });

    this.numeroGuardado.set(this.contador++);
    this.guardado.set(true);
    irAId('mensaje-guardado');
  }

  nuevaSalida() {
    this.fecha = '';
    this.motivo = '';
    this.tipoDocumento = '';
    this.serie = '';
    this.numeroDocumento = '';
    this.area = '';
    this.receptor = '';
    this.observaciones = '';
    this.lineas.set([]);
    this.intentado.set(false);
    this.error.set('');
    this.guardado.set(false);
    irAId('titulo-formulario', 'start');
  }
}
