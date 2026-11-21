import { Component, computed, inject, signal } from '@angular/core';
import { Sesion } from '../../sesion';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';

interface Material { codigo: string; nombre: string; unidad: string; }
interface Linea { material: Material; almacen: string; cantidad: number | null; }

const REGEX_SERIE = /^[A-Z0-9][A-Z0-9-]{0,9}$/;
const REGEX_NUMERO = /^[0-9]{1,10}$/;

@Component({
  selector: 'app-nuevo-ingreso',
  imports: [FormsModule, RouterLink, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nuevo-ingreso.html',
  styleUrl: './nuevo-ingreso.css',
})
export class NuevoIngreso {
  private sesion = inject(Sesion);
  private router = inject(Router);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  motivos = ['Compra', 'Donación', 'Devolución'];
  tiposDocumento = ['Sin documento', 'Factura', 'Guía de remisión', 'Orden de compra'];

  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];
  materiales: Material[] = [
    { codigo: 'MAT-001', nombre: 'Cemento Portland Tipo I', unidad: 'bls' },
    { codigo: 'MAT-002', nombre: 'Brocha de cerda 2"', unidad: 'und' },
    { codigo: 'MAT-003', nombre: 'Bolsa polietileno 10x15', unidad: 'und' },
    { codigo: 'MAT-004', nombre: 'Tubo PVC SAP 1/2"', unidad: 'und' },
    { codigo: 'MAT-005', nombre: 'Pintura látex blanco 4L', unidad: 'gal' },
  ];

 // Datos del ingreso (la fecha empieza vacía)
  fecha = '';
  motivo = '';
  tipoDocumento = '';
  serie = '';
  numeroDocumento = '';

  observaciones = '';

  lineas = signal<Linea[]>([]);
  modalAbierto = signal(false);
  busqueda = signal('');

  // Estado del formulario
  intentado = signal(false);   // ya se intentó guardar: se muestran los errores
  error = signal('');
  guardado = signal(false);    // modo solo lectura
  numeroGuardado = signal(0);
  private contador = 136;      // número provisional; el real lo asignará el backend

  get hoy() { return new Date().toLocaleDateString('en-CA'); }

  // ---------- Validaciones ----------
  vFecha(): string {
    if (!this.fecha) return 'Ingresa la fecha del ingreso.';
    if (this.fecha > this.hoy) return 'La fecha no puede ser futura.';
    return '';
  }
  vMotivo() { return this.motivo ? '' : 'Selecciona un motivo.'; }
  vTipoDocumento() { return this.tipoDocumento ? '' : 'Selecciona el tipo de documento.'; }
  vSerie(): string {
    const s = this.serie.trim();
    if (!s) return ''; // es opcional
    return REGEX_SERIE.test(s) ? '' : 'Usa letras, números o guion (máx. 10), sin espacios.';
  }
  vNumero(): string {
    const n = this.numeroDocumento.trim();
    if (!n) return 'Ingresa el número de documento.';
    if (!REGEX_NUMERO.test(n) || !/[1-9]/.test(n)) return 'Solo números (máx. 10); no puede ser todo ceros.';
    return '';
  }

  vAlmacen(l: Linea) { return l.almacen ? '' : 'Elige almacén'; }
  vCantidad(l: Linea) { return l.cantidad !== null && l.cantidad > 0 ? '' : 'Mayor que cero'; }

  // Solo muestra el error después de intentar guardar
  e(mensaje: string) { return this.intentado() ? mensaje : ''; }

  errores() {
    return {
      fecha: this.e(this.vFecha()),
      motivo: this.e(this.vMotivo()),
      tipoDocumento: this.e(this.vTipoDocumento()),
      serie: this.e(this.vSerie()),
      numero: this.e(this.vNumero()),

      lineas: this.e(this.lineas().length === 0 ? 'Agrega al menos un material.' : ''),
    };
  }

  private formularioValido(): boolean {
    const lineas = this.lineas();
    return !this.vFecha() && !this.vMotivo() && !this.vTipoDocumento() && !this.vSerie()
      && !this.vNumero()
      && lineas.length > 0
      && lineas.every(l => !this.vAlmacen(l) && !this.vCantidad(l));
  }

  // Clases de los cuadros: rojo si hay error
  clase(mensaje: string) {
    return 'w-full rounded-lg border px-3 py-2 text-sm '
      + (mensaje ? 'border-red-500 bg-red-50 campo-error' : 'border-slate-300 bg-white');
  }
  claseLinea(mensaje: string) {
    return 'w-full rounded-lg border px-2 py-1.5 text-sm '
      + (mensaje ? 'border-red-500 bg-red-50 campo-error' : 'border-slate-300 bg-white');
  }

  // Serie y número: se filtran los caracteres no permitidos mientras se escribe
  alEscribirSerie(ev: Event) {
    const el = ev.target as HTMLInputElement;
    el.value = el.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    this.serie = el.value;
  }
  alEscribirNumero(ev: Event) {
    const el = ev.target as HTMLInputElement;
    el.value = el.value.replace(/\D/g, '');
    this.numeroDocumento = el.value;
  }

  // ---------- Buscador de materiales ----------
  resultados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.materiales.filter(m =>
      m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto),
    );
  });

  yaAgregado(m: Material) {
    return this.lineas().some(l => l.material.codigo === m.codigo);
  }

  abrirBuscador() { this.busqueda.set(''); this.modalAbierto.set(true); }
  cerrarBuscador() { this.modalAbierto.set(false); }

  // Agrega la fila sin cerrar la ventana
  agregar(m: Material) {
    if (this.yaAgregado(m)) return;
    this.lineas.update(l => [...l, { material: m, almacen: '', cantidad: null }]);
  }

  quitar(index: number) {
    this.lineas.update(l => l.filter((_, i) => i !== index));
  }

  // ---------- Guardar ----------
  guardar() {
    if (this.guardado()) return;
    this.intentado.set(true);

    if (!this.formularioValido()) {
      this.error.set('Revisa los campos marcados en rojo.');
      setTimeout(() =>
        document.querySelector('.campo-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }
    this.error.set('');

    // Por ahora solo se muestra en la consola (F12). Con el backend, aquí se enviará.
    console.log('Ingreso listo para guardar:', {
      fecha: this.fecha, motivo: this.motivo, tipoDocumento: this.tipoDocumento,
      serie: this.serie, numeroDocumento: this.numeroDocumento,
      usuario: this.sesion.nombre, observaciones: this.observaciones, lineas: this.lineas(),
    });

    this.numeroGuardado.set(this.contador++);
    this.guardado.set(true);
    setTimeout(() =>
      document.getElementById('mensaje-guardado')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  // Limpia todo para registrar otro ingreso
  nuevoIngreso() {
    this.fecha = '';
    this.motivo = '';
    this.tipoDocumento = '';
    this.serie = '';
    this.numeroDocumento = '';

    this.observaciones = '';
    this.lineas.set([]);
    this.busqueda.set('');
    this.intentado.set(false);
    this.error.set('');
    this.guardado.set(false);
    setTimeout(() =>
      document.getElementById('titulo-ingreso')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
}
