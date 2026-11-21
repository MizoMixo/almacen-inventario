import { Component, computed, inject, signal  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';
import { Sesion } from '../../sesion';
import {
  claseCampo, claseCampoTabla, errorFecha, errorNumero, errorSerie, hoyISO,
  irAId, irAlPrimerError, limpiarNumero, limpiarSerie,
} from '../../shared/validaciones';

interface Material { codigo: string; nombre: string; unidad: string; }
interface Linea { material: Material; almacen: string; cantidad: number | null; }

@Component({
  selector: 'app-nueva-salida',
  imports: [FormsModule, RouterLink, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nueva-salida.html',
  styleUrl: './nueva-salida.css',
})

export class NuevaSalida {
  private sesion = inject(Sesion);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  motivos = ['Consumo', 'Entrega a personal o área', 'Baja o merma', 'Donación'];
  tiposDocumento = ['Requerimiento', 'Guía de remisión', 'Acta de entrega', 'Vale de salida'];
  areas = ['Conservación', 'Mantenimiento', 'Administración'];
  receptores = ['Luis Rojas', 'María Quispe', 'Carlos Vega'];
  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];
  materiales: Material[] = [
    { codigo: 'MAT-001', nombre: 'Cemento Portland Tipo I', unidad: 'bls' },
    { codigo: 'MAT-002', nombre: 'Brocha de cerda 2"', unidad: 'und' },
    { codigo: 'MAT-003', nombre: 'Bolsa polietileno 10x15', unidad: 'und' },
    { codigo: 'MAT-004', nombre: 'Tubo PVC SAP 1/2"', unidad: 'und' },
    { codigo: 'MAT-005', nombre: 'Pintura látex blanco 4L', unidad: 'gal' },
  ];

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
  modalAbierto = signal(false);
  busqueda = signal('');

  intentado = signal(false);
  error = signal('');
  guardado = signal(false);
  numeroGuardado = signal(0);
  private contador = 232; // número provisional; el real lo asignará el backend

  clase = claseCampo;
  claseLinea = claseCampoTabla;
  get hoy() { return hoyISO(); }

  // ---------- Validaciones ----------
  vMotivo() { return this.motivo ? '' : 'Selecciona un motivo.'; }
  vTipoDocumento() { return this.tipoDocumento ? '' : 'Selecciona el tipo de documento.'; }
  vAlmacen(l: Linea) { return l.almacen ? '' : 'Elige almacén'; }
  vCantidad(l: Linea) { return l.cantidad !== null && l.cantidad > 0 ? '' : 'Mayor que cero'; }

  e(mensaje: string) { return this.intentado() ? mensaje : ''; }

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
    return !errorFecha(this.fecha) && !this.vMotivo() && !this.vTipoDocumento()
      && !errorSerie(this.serie) && !errorNumero(this.numeroDocumento)
      && lineas.length > 0
      && lineas.every(l => !this.vAlmacen(l) && !this.vCantidad(l));
  }

  alEscribirSerie(ev: Event) { this.serie = limpiarSerie(ev); }
  alEscribirNumero(ev: Event) { this.numeroDocumento = limpiarNumero(ev); }

  // ---------- Buscador de materiales ----------
  resultados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.materiales.filter(m =>
      m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto),
    );
  });

  yaAgregado(m: Material) { return this.lineas().some(l => l.material.codigo === m.codigo); }
  abrirBuscador() { this.busqueda.set(''); this.modalAbierto.set(true); }
  cerrarBuscador() { this.modalAbierto.set(false); }

  agregar(m: Material) {
    if (this.yaAgregado(m)) return;
    this.lineas.update(l => [...l, { material: m, almacen: '', cantidad: null }]);
  }

  quitar(index: number) { this.lineas.update(l => l.filter((_, i) => i !== index)); }

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
      fecha: this.fecha, motivo: this.motivo, tipoDocumento: this.tipoDocumento,
      serie: this.serie, numeroDocumento: this.numeroDocumento, area: this.area,
      receptor: this.receptor, observaciones: this.observaciones,
      usuario: this.sesion.nombre, lineas: this.lineas(),
    });

    this.numeroGuardado.set(this.contador++);
    this.guardado.set(true);
    irAId('mensaje-guardado');
  }

  nuevaSalida() {
    this.fecha = ''; this.motivo = ''; this.tipoDocumento = ''; this.serie = '';
    this.numeroDocumento = ''; this.area = ''; this.receptor = ''; this.observaciones = '';
    this.lineas.set([]);
    this.busqueda.set('');
    this.intentado.set(false);
    this.error.set('');
    this.guardado.set(false);
    irAId('titulo-salida', 'start');
  }
}
