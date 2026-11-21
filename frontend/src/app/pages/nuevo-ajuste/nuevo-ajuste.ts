import { Component, computed, inject, signal  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideDownload, LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';
import { Sesion } from '../../sesion';
import {
  claseCampo, claseCampoTabla, errorFecha, hoyISO, irAId, irAlPrimerError,
} from '../../shared/validaciones';

interface Material { codigo: string; nombre: string; unidad: string; }
interface Linea { material: Material; sistema: number; fisico: number | null; nota: string; }

@Component({
  selector: 'app-nuevo-ajuste',
  imports: [FormsModule, RouterLink, LucideDownload, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nuevo-ajuste.html',
  styleUrl: './nuevo-ajuste.css',
})
export class NuevoAjuste {
  private route = inject(ActivatedRoute);
  private sesion = inject(Sesion);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];
  tipoGeneral = 'Inventario general trimestral';
  tipos = ['Regularización por diferencia física', 'Carga de stock inicial', this.tipoGeneral];
  materiales: Material[] = [
    { codigo: 'MAT-001', nombre: 'Cemento Portland Tipo I', unidad: 'bls' },
    { codigo: 'MAT-002', nombre: 'Brocha de cerda 2"', unidad: 'und' },
    { codigo: 'MAT-003', nombre: 'Bolsa polietileno 10x15', unidad: 'und' },
    { codigo: 'MAT-004', nombre: 'Tubo PVC SAP 1/2"', unidad: 'und' },
    { codigo: 'MAT-005', nombre: 'Pintura látex blanco 4L', unidad: 'gal' },
  ];

  // Stock de ejemplo por almacén (luego se calculará con los movimientos)
  stock: Record<string, Record<string, number>> = {
    'Almacén Central': { 'MAT-001': 45, 'MAT-002': 12, 'MAT-003': 15, 'MAT-004': 30, 'MAT-005': 8 },
    'Almacén Campo': { 'MAT-001': 10, 'MAT-002': 2, 'MAT-005': 5 },
    'Almacén Vichama': { 'MAT-003': 25, 'MAT-004': 6 },
  };

  // Datos del ajuste (la fecha empieza vacía). Desde "Conteo general trimestral" el tipo ya viene elegido.
  fecha = '';
  tipo = this.route.snapshot.queryParamMap.get('tipo') === 'general' ? this.tipoGeneral : this.tipos[0];
  documento = '';
  justificacion = '';

  almacen = signal('');
  lineas = signal<Linea[]>([]);
  filtro = signal('');
  modalAbierto = signal(false);
  busqueda = signal('');

  intentado = signal(false);
  error = signal('');
  guardado = signal(false);
  numeroGuardado = signal(0);
  private contador = 13; // número provisional; el real lo asignará el backend

  clase = claseCampo;
  claseLinea = claseCampoTabla;
  get hoy() { return hoyISO(); }

  esGeneral() { return this.tipo === this.tipoGeneral; }

  cambiarAlmacen(valor: string) {
    this.almacen.set(valor);
    this.lineas.set([]); // el stock del sistema cambia, así que se vacía la tabla
    if (valor && this.esGeneral()) this.cargarTodos();
  }

  cambiarTipo(valor: string) {
    this.tipo = valor;
    if (this.esGeneral() && this.almacen() && this.lineas().length === 0) this.cargarTodos();
  }

  sistemaEn(codigo: string): number {
    return this.stock[this.almacen()]?.[codigo] ?? 0;
  }

  // ---------- Validaciones ----------
  vAlmacen() { return this.almacen() ? '' : 'Selecciona el almacén.'; }
  vTipo() { return this.tipo ? '' : 'Selecciona el tipo de ajuste.'; }
  vDocumento(): string {
    const d = this.documento.trim();
    if (!d) return ''; // es opcional
    return /^[A-Z0-9][A-Z0-9\-\/]{0,29}$/.test(d) ? '' : 'Usa letras, números, guion o barra (máx. 30).';
  }
  vJustificacion(): string {
    const j = this.justificacion.trim();
    if (!j) return 'Describe el motivo del ajuste.';
    if (j.length < 10) return 'Escribe al menos 10 caracteres.';
    if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(j)) return 'Debe incluir texto, no solo números o símbolos.';
    return '';
  }
  vFisico(l: Linea) {
    return l.fisico === null || l.fisico === undefined || l.fisico < 0 ? 'Obligatorio (0 o más)' : '';
  }

  e(mensaje: string) { return this.intentado() ? mensaje : ''; }

  errores() {
    return {
      fecha: this.e(errorFecha(this.fecha)),
      almacen: this.e(this.vAlmacen()),
      tipo: this.e(this.vTipo()),
      documento: this.e(this.vDocumento()),
      justificacion: this.e(this.vJustificacion()),
      lineas: this.e(this.lineas().length === 0 ? 'Agrega al menos un material.' : ''),
    };
  }

  private formularioValido(): boolean {
    const lineas = this.lineas();
    return !errorFecha(this.fecha) && !this.vAlmacen() && !this.vTipo() && !this.vDocumento()
      && !this.vJustificacion()
      && lineas.length > 0
      && lineas.every(l => !this.vFisico(l));
  }

  alEscribirDocumento(ev: Event) {
    const el = ev.target as HTMLInputElement;
    el.value = el.value.toUpperCase().replace(/[^A-Z0-9\-\/]/g, '');
    this.documento = el.value;
  }

  // ---------- Tabla y buscador ----------
  lineasVisibles = computed(() => {
    const texto = this.filtro().toLowerCase().trim();
    return this.lineas().filter(l =>
      l.material.codigo.toLowerCase().includes(texto) || l.material.nombre.toLowerCase().includes(texto),
    );
  });

  // Incluye materiales con stock 0, para poder cargar el stock inicial
  resultados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.materiales.filter(m =>
      m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto),
    );
  });

  yaAgregado(m: Material) { return this.lineas().some(l => l.material.codigo === m.codigo); }
  abrirBuscador() { this.busqueda.set(''); this.modalAbierto.set(true); }
  cerrarBuscador() { this.modalAbierto.set(false); }

  // El stock físico empieza igual al del sistema
  private nuevaLinea(m: Material): Linea {
    const sistema = this.sistemaEn(m.codigo);
    return { material: m, sistema, fisico: sistema, nota: '' };
  }

  agregar(m: Material) {
    if (this.yaAgregado(m)) return;
    this.lineas.update(l => [...l, this.nuevaLinea(m)]);
  }

  cargarTodos() {
    const usados = this.lineas().map(l => l.material.codigo);
    const nuevas = this.materiales.filter(m => !usados.includes(m.codigo)).map(m => this.nuevaLinea(m));
    this.lineas.update(l => [...l, ...nuevas]);
  }

  quitar(codigo: string) {
    this.lineas.update(l => l.filter(x => x.material.codigo !== codigo));
  }

  // Diferencia = stock físico contado - stock del sistema
  diferencia(l: Linea): number | null {
    if (l.fisico === null || l.fisico === undefined) return null;
    return Math.round((l.fisico - l.sistema) * 10000) / 10000;
  }

  resumen() {
    let sobrantes = 0, faltantes = 0, sinCambio = 0;
    for (const l of this.lineas()) {
      const d = this.diferencia(l);
      if (d === null) continue;
      if (d > 0) sobrantes++;
      else if (d < 0) faltantes++;
      else sinCambio++;
    }
    return { sobrantes, faltantes, sinCambio };
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

    // Solo las líneas con diferencia generan movimientos
    const movimientos = this.lineas()
      .map(l => ({ l, d: this.diferencia(l)! }))
      .filter(x => x.d !== 0)
      .map(x => ({
        material: x.l.material.codigo,
        tipo: x.d > 0 ? 'AUMENTO' : 'DISMINUCION',
        cantidad: Math.abs(x.d),
        nota: x.l.nota,
      }));
    if (movimientos.length === 0) {
      this.error.set('No hay diferencias que aplicar: todo coincide con el stock del sistema.');
      return;
    }
    this.error.set('');

    // Por ahora solo se muestra en la consola (F12). Con el backend, aquí se enviará.
    console.log('Ajuste listo para guardar:', {
      fecha: this.fecha, almacen: this.almacen(), tipo: this.tipo, documento: this.documento,
      justificacion: this.justificacion, usuario: this.sesion.nombre, movimientos,
    });

    this.numeroGuardado.set(this.contador++);
    this.guardado.set(true);
    irAId('mensaje-guardado');
  }

  nuevoAjuste() {
    this.fecha = ''; this.tipo = this.tipos[0]; this.documento = ''; this.justificacion = '';
    this.almacen.set('');
    this.lineas.set([]);
    this.filtro.set('');
    this.busqueda.set('');
    this.intentado.set(false);
    this.error.set('');
    this.guardado.set(false);
    irAId('titulo-ajuste', 'start');
  }
}
