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
  hoyISO,
  irAId,
  irAlPrimerError,
  limpiarNumero,
} from '@shared/utils/validaciones';

interface Linea {
  material: Material;
  stock: number;
  cantidad: number | null;
}

@Component({
  selector: 'app-nueva-transferencia',
  imports: [
    FormsModule,
    LucidePlus,
    LucideTrash,
    BuscadorMateriales,
    EncabezadoFormulario,
    AccionesFormulario,
  ],
  templateUrl: './nueva-transferencia.html',
  styleUrl: './nueva-transferencia.css',
})
export class NuevaTransferencia {
  private sesion = inject(Sesion);
  private catalogos = inject(Catalogos);

  // Catálogos (vienen del servicio)
  almacenes = this.catalogos.almacenes;
  motivos = this.catalogos.motivosTransferencia;
  tiposDocumento = this.catalogos.tiposDocumentoTransferencia;
  materiales = this.catalogos.materiales;

  // Datos de la transferencia (la fecha empieza vacía)
  fecha = '';
  destino = '';
  motivo = this.motivos[0];
  tipoDocumento = '';
  numeroDocumento = '';
  observaciones = '';

  origen = signal('');
  lineas = signal<Linea[]>([]);
  seleccionados = computed(() => this.lineas().map((l) => l.material.codigo));
  modalAbierto = signal(false);

  intentado = signal(false);
  error = signal('');
  guardado = signal(false);
  numeroGuardado = signal(0);
  private contador = 35; // número provisional; el real lo asignará el backend

  clase = claseCampo;
  claseLinea = claseCampoTabla;
  get hoy() {
    return hoyISO();
  }

  stockEn(codigo: string): number {
    return this.catalogos.stockEn(this.origen(), codigo);
  }

  // Solo materiales con stock en el origen
  disponibles = computed(() => this.materiales.filter((m) => this.stockEn(m.codigo) > 0));

  // Texto gris del buscador: muestra el stock en el origen
  detalleStock = (m: Material) => `${m.codigo} · Stock: ${this.stockEn(m.codigo)} ${m.unidad}`;

  cambiarOrigen(valor: string) {
    this.origen.set(valor);
    if (this.destino === valor) this.destino = ''; // no puede ser el mismo almacén
    this.lineas.set([]); // el stock cambia, así que se vacía la tabla
  }

  // ---------- Validaciones ----------
  vOrigen() {
    return this.origen() ? '' : 'Selecciona el almacén de origen.';
  }
  vDestino() {
    if (!this.destino) return 'Selecciona el almacén de destino.';
    if (this.destino === this.origen()) return 'Debe ser distinto al de origen.';
    return '';
  }
  vMotivo() {
    return this.motivo ? '' : 'Selecciona un motivo.';
  }
  vTipoDocumento() {
    return this.tipoDocumento ? '' : 'Selecciona el tipo de documento.';
  }
  vCantidad(l: Linea) {
    if (l.cantidad === null || l.cantidad <= 0) return 'Mayor que cero';
    if (l.cantidad > l.stock) return 'Máx. ' + l.stock;
    return '';
  }

  e(mensaje: string) {
    return this.intentado() ? mensaje : '';
  }

  errores() {
    return {
      fecha: this.e(errorFecha(this.fecha)),
      origen: this.e(this.vOrigen()),
      destino: this.e(this.vDestino()),
      motivo: this.e(this.vMotivo()),
      tipoDocumento: this.e(this.vTipoDocumento()),
      numero: this.e(errorNumero(this.numeroDocumento)),
      lineas: this.e(this.lineas().length === 0 ? 'Agrega al menos un material.' : ''),
    };
  }

  private formularioValido(): boolean {
    const lineas = this.lineas();
    return (
      !errorFecha(this.fecha) &&
      !this.vOrigen() &&
      !this.vDestino() &&
      !this.vMotivo() &&
      !this.vTipoDocumento() &&
      !errorNumero(this.numeroDocumento) &&
      lineas.length > 0 &&
      lineas.every((l) => !this.vCantidad(l))
    );
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
    this.lineas.update((l) => [
      ...l,
      { material: m, stock: this.stockEn(m.codigo), cantidad: null },
    ]);
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
    console.log('Transferencia lista para guardar:', {
      fecha: this.fecha,
      origen: this.origen(),
      destino: this.destino,
      motivo: this.motivo,
      tipoDocumento: this.tipoDocumento,
      numeroDocumento: this.numeroDocumento,
      observaciones: this.observaciones,
      usuario: this.sesion.nombre,
      lineas: this.lineas(),
    });

    this.numeroGuardado.set(this.contador++);
    this.guardado.set(true);
    irAId('mensaje-guardado');
  }

  nuevaTransferencia() {
    this.fecha = '';
    this.destino = '';
    this.motivo = this.motivos[0];
    this.tipoDocumento = '';
    this.numeroDocumento = '';
    this.observaciones = '';
    this.origen.set('');
    this.lineas.set([]);
    this.intentado.set(false);
    this.error.set('');
    this.guardado.set(false);
    irAId('titulo-formulario', 'start');
  }
}
