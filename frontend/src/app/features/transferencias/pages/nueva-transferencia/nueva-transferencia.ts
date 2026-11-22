import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';
import { Sesion } from '@core/auth/sesion';
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

interface Material {
  codigo: string;
  nombre: string;
  unidad: string;
}
interface Linea {
  material: Material;
  stock: number;
  cantidad: number | null;
}

@Component({
  selector: 'app-nueva-transferencia',
  imports: [FormsModule, RouterLink, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nueva-transferencia.html',
  styleUrl: './nueva-transferencia.css',
})
export class NuevaTransferencia {
  private sesion = inject(Sesion);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];
  motivos = ['Abastecimiento de obra / sede', 'Reubicación', 'Devolución a almacén central'];
  tiposDocumento = ['Guía de remisión', 'Guía interna', 'Acta de entrega'];
  materiales: Material[] = [
    { codigo: 'MAT-001', nombre: 'Cemento Portland Tipo I', unidad: 'bls' },
    { codigo: 'MAT-002', nombre: 'Brocha de cerda 2"', unidad: 'und' },
    { codigo: 'MAT-003', nombre: 'Bolsa polietileno 10x15', unidad: 'und' },
    { codigo: 'MAT-004', nombre: 'Tubo PVC SAP 1/2"', unidad: 'und' },
    { codigo: 'MAT-005', nombre: 'Pintura látex blanco 4L', unidad: 'gal' },
  ];

  // Stock de ejemplo por almacén (luego se calculará con los movimientos)
  stock: Record<string, Record<string, number>> = {
    'Almacén Central': { 'MAT-001': 40, 'MAT-002': 12, 'MAT-003': 15, 'MAT-004': 30, 'MAT-005': 8 },
    'Almacén Campo': { 'MAT-001': 10, 'MAT-002': 2, 'MAT-005': 5 },
    'Almacén Vichama': { 'MAT-003': 25, 'MAT-004': 6 },
  };

  // Datos de la transferencia (la fecha empieza vacía)
  fecha = '';
  destino = '';
  motivo = this.motivos[0];
  tipoDocumento = '';
  numeroDocumento = '';
  observaciones = '';

  origen = signal('');
  lineas = signal<Linea[]>([]);
  modalAbierto = signal(false);
  busqueda = signal('');

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

  // ---------- Buscador de materiales ----------
  stockEn(codigo: string): number {
    return this.stock[this.origen()]?.[codigo] ?? 0;
  }

  // Solo materiales con stock en el origen
  resultados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const stockOrigen = this.stock[this.origen()] ?? {};
    return this.materiales.filter(
      (m) =>
        (stockOrigen[m.codigo] ?? 0) > 0 &&
        (m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto)),
    );
  });

  yaAgregado(m: Material) {
    return this.lineas().some((l) => l.material.codigo === m.codigo);
  }
  abrirBuscador() {
    this.busqueda.set('');
    this.modalAbierto.set(true);
  }
  cerrarBuscador() {
    this.modalAbierto.set(false);
  }

  agregar(m: Material) {
    if (this.yaAgregado(m)) return;
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
    this.busqueda.set('');
    this.intentado.set(false);
    this.error.set('');
    this.guardado.set(false);
    irAId('titulo-transferencia', 'start');
  }
}
