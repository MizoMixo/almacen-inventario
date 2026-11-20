import { Component, computed, inject, signal  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';

interface Material { codigo: string; nombre: string; unidad: string; }
interface Linea { material: Material; stock: number; cantidad: number | null; }


@Component({
  selector: 'app-nueva-transferencia',
  imports: [FormsModule, RouterLink, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nueva-transferencia.html',
  styleUrl: './nueva-transferencia.css',
})
export class NuevaTransferencia {
  private router = inject(Router);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];
  motivos = ['Abastecimiento de obra / sede', 'Reubicación', 'Devolución a almacén central'];
  tiposDocumento = ['Sin documento', 'Guía de remisión', 'Guía interna', 'Acta de entrega'];
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
    'Almacén Central': { 'MAT-001': 40, 'MAT-002': 12, 'MAT-003': 15, 'MAT-004': 30, 'MAT-005': 8 },
    'Almacén Campo': { 'MAT-001': 10, 'MAT-002': 2, 'MAT-005': 5 },
    'Almacén Vichama': { 'MAT-003': 25, 'MAT-004': 6 },
  };

  // Datos de la transferencia
  fecha = new Date().toLocaleDateString('en-CA');
  destino = '';
  motivo = this.motivos[0];
  tipoDocumento = 'Sin documento';
  numeroDocumento = '';
  usuario = '';
  observaciones = '';

  // El origen es una señal porque al cambiarlo se actualizan los materiales disponibles
  origen = signal('');
  lineas = signal<Linea[]>([]);
  modalAbierto = signal(false);
  busqueda = signal('');
  error = signal('');

  cambiarOrigen(valor: string) {
    this.origen.set(valor);
    this.lineas.set([]); // el stock cambia, así que se vacía la tabla
  }

  // Solo materiales con stock en el origen y que aún no se agregaron
  resultados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const usados = this.lineas().map(l => l.material.codigo);
    const stockOrigen = this.stock[this.origen()] ?? {};
    return this.materiales.filter(m =>
      (stockOrigen[m.codigo] ?? 0) > 0 &&
      !usados.includes(m.codigo) &&
      (m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto)),
    );
  });

  stockEn(codigo: string): number {
    return this.stock[this.origen()]?.[codigo] ?? 0;
  }

  abrirBuscador() { this.busqueda.set(''); this.modalAbierto.set(true); }
  cerrarBuscador() { this.modalAbierto.set(false); }

  agregar(material: Material) {
    this.lineas.update(l => [...l, { material, stock: this.stockEn(material.codigo), cantidad: null }]);
    this.cerrarBuscador();
  }

  quitar(index: number) {
    this.lineas.update(l => l.filter((_, i) => i !== index));
  }

  guardar() {
    if (!this.fecha || !this.origen() || !this.destino || !this.motivo || !this.usuario) {
      this.error.set('Completa los campos obligatorios (*).');
      return;
    }
    if (this.origen() === this.destino) {
      this.error.set('El almacén de origen y el de destino deben ser distintos.');
      return;
    }
    const lineas = this.lineas();
    if (lineas.length === 0) {
      this.error.set('Agrega al menos un material.');
      return;
    }
    if (lineas.some(l => !l.cantidad || l.cantidad <= 0)) {
      this.error.set('La cantidad de cada material debe ser mayor que cero.');
      return;
    }
    if (lineas.some(l => l.cantidad! > l.stock)) {
      this.error.set('Una cantidad supera el stock disponible en el almacén de origen.');
      return;
    }
    this.error.set('');

    // Por ahora solo se muestra en la consola (F12). Con el backend, aquí se enviará.
    console.log('Transferencia lista para guardar:', {
      fecha: this.fecha, origen: this.origen(), destino: this.destino, motivo: this.motivo,
      tipoDocumento: this.tipoDocumento, numeroDocumento: this.numeroDocumento,
      usuario: this.usuario, observaciones: this.observaciones, lineas,
    });
    this.router.navigate(['/transferencias']);
  }
}
