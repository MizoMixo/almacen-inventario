import { Component, computed, inject, signal  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideDownload, LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';

interface Material { codigo: string; nombre: string; unidad: string; }
interface Linea { material: Material; sistema: number; fisico: number | null; nota: string; }

@Component({
  selector: 'app-nuevo-ajuste',
  imports: [FormsModule, RouterLink, LucideDownload, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nuevo-ajuste.html',
  styleUrl: './nuevo-ajuste.css',
})
export class NuevoAjuste {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];
  tipoGeneral = 'Inventario general trimestral';
  tipos = ['Regularización por diferencia física', 'Carga de stock inicial', this.tipoGeneral];
  usuarios = ['Rony Castro', 'Ana Torres'];
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

  // Datos del ajuste. Si vienes de "Conteo general trimestral", el tipo ya viene elegido.
  fecha = new Date().toLocaleDateString('en-CA');
  tipo = this.route.snapshot.queryParamMap.get('tipo') === 'general' ? this.tipoGeneral : this.tipos[0];
  documento = '';
  justificacion = '';
  usuario = '';

  almacen = signal('');
  lineas = signal<Linea[]>([]);
  filtro = signal('');
  modalAbierto = signal(false);
  busqueda = signal('');
  error = signal('');

  esGeneral() { return this.tipo === this.tipoGeneral; }

    cambiarAlmacen(valor: string) {
    this.almacen.set(valor);
    this.lineas.set([]); // el stock del sistema cambia, así que se vacía la tabla
    if (valor && this.esGeneral()) this.cargarTodos();
  }

  // Si eliges "Inventario general trimestral" con el almacén ya elegido y la tabla vacía, carga todo
  cambiarTipo(valor: string) {
    this.tipo = valor;
    if (this.esGeneral() && this.almacen() && this.lineas().length === 0) this.cargarTodos();
  }

  sistemaEn(codigo: string): number {
    return this.stock[this.almacen()]?.[codigo] ?? 0;
  }

  // Filtro de la tabla
  lineasVisibles = computed(() => {
    const texto = this.filtro().toLowerCase().trim();
    return this.lineas().filter(l =>
      l.material.codigo.toLowerCase().includes(texto) || l.material.nombre.toLowerCase().includes(texto),
    );
  });

  // Buscador: incluye materiales con stock 0, para poder cargar el stock inicial
  resultados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const usados = this.lineas().map(l => l.material.codigo);
    return this.materiales.filter(m =>
      !usados.includes(m.codigo) &&
      (m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto)),
    );
  });

  abrirBuscador() { this.busqueda.set(''); this.modalAbierto.set(true); }
  cerrarBuscador() { this.modalAbierto.set(false); }

    private nuevaLinea(m: Material): Linea {
    const sistema = this.sistemaEn(m.codigo);
    return { material: m, sistema, fisico: sistema, nota: '' };
  }

  agregar(m: Material) {
    this.lineas.update(l => [...l, this.nuevaLinea(m)]);
    this.cerrarBuscador();
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

  guardar() {
    if (!this.fecha || !this.almacen() || !this.tipo || !this.justificacion.trim() || !this.usuario) {
      this.error.set('Completa los campos obligatorios (*).');
      return;
    }
    const lineas = this.lineas();
    if (lineas.length === 0) {
      this.error.set('Agrega al menos un material.');
      return;
    }
    if (lineas.some(l => l.fisico === null || l.fisico === undefined || l.fisico < 0)) {
      this.error.set('Ingresa el stock físico contado de cada material (puede ser 0, no negativo).');
      return;
    }
    // Solo las líneas con diferencia generan movimientos
    const movimientos = lineas
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
      justificacion: this.justificacion, usuario: this.usuario, movimientos,
    });
    this.router.navigate(['/ajuste-inventario']);
  }
}
