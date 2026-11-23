import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LucideDownload, LucidePlus, LucideTrash } from '@lucide/angular';
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
  hoyISO,
  irAId,
  irAlPrimerError,
} from '@shared/utils/validaciones';

interface Linea {
  material: Material;
  sistema: number;
  fisico: number | null;
  nota: string;
}

@Component({
  selector: 'app-nuevo-ajuste',
  imports: [
    FormsModule,
    LucideDownload,
    LucidePlus,
    LucideTrash,
    BuscadorMateriales,
    EncabezadoFormulario,
    AccionesFormulario,
  ],
  templateUrl: './nuevo-ajuste.html',
  styleUrl: './nuevo-ajuste.css',
})
export class NuevoAjuste {
  private route = inject(ActivatedRoute);
  private sesion = inject(Sesion);
  private catalogos = inject(Catalogos);

  // Catálogos (vienen del servicio)
  almacenes = this.catalogos.almacenes;
  tipos = this.catalogos.tiposAjuste;
  tipoGeneral = this.catalogos.tipoAjusteGeneral;
  materiales = this.catalogos.materiales;

  // Datos del ajuste (la fecha empieza vacía). Desde "Conteo general trimestral" el tipo ya viene elegido.
  fecha = '';
  tipo =
    this.route.snapshot.queryParamMap.get('tipo') === 'general' ? this.tipoGeneral : this.tipos[0];
  documento = '';
  justificacion = '';

  almacen = signal('');
  lineas = signal<Linea[]>([]);
  seleccionados = computed(() => this.lineas().map((l) => l.material.codigo));
  filtro = signal('');
  modalAbierto = signal(false);

  intentado = signal(false);
  error = signal('');
  guardado = signal(false);
  numeroGuardado = signal(0);
  private contador = 13; // número provisional; el real lo asignará el backend

  clase = claseCampo;
  claseLinea = claseCampoTabla;
  get hoy() {
    return hoyISO();
  }

  esGeneral() {
    return this.tipo === this.tipoGeneral;
  }

  sistemaEn(codigo: string): number {
    return this.catalogos.stockEn(this.almacen(), codigo);
  }

  // Texto gris del buscador: muestra el stock del sistema
  detalleSistema = (m: Material) =>
    `${m.codigo} · Stock sistema: ${this.sistemaEn(m.codigo)} ${m.unidad}`;

  cambiarAlmacen(valor: string) {
    this.almacen.set(valor);
    this.lineas.set([]); // el stock del sistema cambia, así que se vacía la tabla
    if (valor && this.esGeneral()) this.cargarTodos();
  }

  cambiarTipo(valor: string) {
    this.tipo = valor;
    if (this.esGeneral() && this.almacen() && this.lineas().length === 0) this.cargarTodos();
  }

  // ---------- Validaciones ----------
  vAlmacen() {
    return this.almacen() ? '' : 'Selecciona el almacén.';
  }
  vTipo() {
    return this.tipo ? '' : 'Selecciona el tipo de ajuste.';
  }
  vDocumento(): string {
    const d = this.documento.trim();
    if (!d) return ''; // es opcional
    return /^[A-Z0-9][A-Z0-9\-\/]{0,29}$/.test(d)
      ? ''
      : 'Usa letras, números, guion o barra (máx. 30).';
  }
  vJustificacion(): string {
    const j = this.justificacion.trim();
    if (!j) return 'Describe el motivo del ajuste.';
    if (j.length < 10) return 'Escribe al menos 10 caracteres.';
    if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(j)) return 'Debe incluir texto, no solo números o símbolos.';
    return '';
  }
  vFisico(l: Linea) {
    return l.fisico === null || l.fisico === undefined || l.fisico < 0
      ? 'Obligatorio (0 o más)'
      : '';
  }

  e(mensaje: string) {
    return this.intentado() ? mensaje : '';
  }

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
    return (
      !errorFecha(this.fecha) &&
      !this.vAlmacen() &&
      !this.vTipo() &&
      !this.vDocumento() &&
      !this.vJustificacion() &&
      lineas.length > 0 &&
      lineas.every((l) => !this.vFisico(l))
    );
  }

  alEscribirDocumento(ev: Event) {
    const el = ev.target as HTMLInputElement;
    el.value = el.value.toUpperCase().replace(/[^A-Z0-9\-\/]/g, '');
    this.documento = el.value;
  }

  // ---------- Tabla y materiales ----------
  lineasVisibles = computed(() => {
    const texto = this.filtro().toLowerCase().trim();
    return this.lineas().filter(
      (l) =>
        l.material.codigo.toLowerCase().includes(texto) ||
        l.material.nombre.toLowerCase().includes(texto),
    );
  });

  abrirBuscador() {
    this.modalAbierto.set(true);
  }
  cerrarBuscador() {
    this.modalAbierto.set(false);
  }

  // El stock físico empieza igual al del sistema
  private nuevaLinea(m: Material): Linea {
    const sistema = this.sistemaEn(m.codigo);
    return { material: m, sistema, fisico: sistema, nota: '' };
  }

  agregar(m: Material) {
    if (this.seleccionados().includes(m.codigo)) return;
    this.lineas.update((l) => [...l, this.nuevaLinea(m)]);
  }

  cargarTodos() {
    const usados = this.seleccionados();
    const nuevas = this.materiales
      .filter((m) => !usados.includes(m.codigo))
      .map((m) => this.nuevaLinea(m));
    this.lineas.update((l) => [...l, ...nuevas]);
  }

  quitar(codigo: string) {
    this.lineas.update((l) => l.filter((x) => x.material.codigo !== codigo));
  }

  // Diferencia = stock físico contado - stock del sistema
  diferencia(l: Linea): number | null {
    if (l.fisico === null || l.fisico === undefined) return null;
    return Math.round((l.fisico - l.sistema) * 10000) / 10000;
  }

  resumen() {
    let sobrantes = 0,
      faltantes = 0,
      sinCambio = 0;
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
      .map((l) => ({ l, d: this.diferencia(l)! }))
      .filter((x) => x.d !== 0)
      .map((x) => ({
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
      fecha: this.fecha,
      almacen: this.almacen(),
      tipo: this.tipo,
      documento: this.documento,
      justificacion: this.justificacion,
      usuario: this.sesion.nombre,
      movimientos,
    });

    this.numeroGuardado.set(this.contador++);
    this.guardado.set(true);
    irAId('mensaje-guardado');
  }

  nuevoAjuste() {
    this.fecha = '';
    this.tipo = this.tipos[0];
    this.documento = '';
    this.justificacion = '';
    this.almacen.set('');
    this.lineas.set([]);
    this.filtro.set('');
    this.intentado.set(false);
    this.error.set('');
    this.guardado.set(false);
    irAId('titulo-formulario', 'start');
  }
}
