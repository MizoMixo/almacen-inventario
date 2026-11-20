import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';

interface Material { codigo: string; nombre: string; unidad: string; }
interface Linea { material: Material; almacen: string; cantidad: number | null; }

@Component({
  selector: 'app-nuevo-ingreso',
  imports: [FormsModule, RouterLink, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nuevo-ingreso.html',
  styleUrl: './nuevo-ingreso.css',
})
export class NuevoIngreso {
  private router = inject(Router);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  motivos = ['Compra', 'Donación', 'Devolución'];
  tiposDocumento = ['Sin documento', 'Factura', 'Guía de remisión', 'Orden de compra'];
  usuarios = ['Rony Castro', 'Ana Torres'];
  almacenes = ['Almacén Central', 'Almacén Campo', 'Almacén Vichama'];
  materiales: Material[] = [
    { codigo: 'MAT-001', nombre: 'Cemento Portland Tipo I', unidad: 'bls' },
    { codigo: 'MAT-002', nombre: 'Brocha de cerda 2"', unidad: 'und' },
    { codigo: 'MAT-003', nombre: 'Bolsa polietileno 10x15', unidad: 'und' },
    { codigo: 'MAT-004', nombre: 'Tubo PVC SAP 1/2"', unidad: 'und' },
    { codigo: 'MAT-005', nombre: 'Pintura látex blanco 4L', unidad: 'gal' },
  ];

  // Datos del ingreso (fecha de hoy según tu zona horaria)
  fecha = new Date().toLocaleDateString('en-CA');
  motivo = '';
  tipoDocumento = 'Sin documento';
  serie = '';
  numeroDocumento = '';
  usuario = '';
  observaciones = '';

  // Materiales del ingreso, buscador y mensaje de error
  lineas = signal<Linea[]>([]);
  modalAbierto = signal(false);
  busqueda = signal('');
  error = signal('');

  // Resultados del buscador: no muestra materiales que ya agregaste
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

  agregar(material: Material) {
    this.lineas.update(l => [...l, { material, almacen: '', cantidad: null }]);
    this.cerrarBuscador();
  }

  quitar(index: number) {
    this.lineas.update(l => l.filter((_, i) => i !== index));
  }

  guardar() {
    if (!this.fecha || !this.motivo || !this.usuario) {
      this.error.set('Completa los campos obligatorios (*).');
      return;
    }
    const lineas = this.lineas();
    if (lineas.length === 0) {
      this.error.set('Agrega al menos un material.');
      return;
    }
    if (lineas.some(l => !l.almacen)) {
      this.error.set('Selecciona el almacén destino de cada material.');
      return;
    }
    if (lineas.some(l => !l.cantidad || l.cantidad <= 0)) {
      this.error.set('La cantidad de cada material debe ser mayor que cero.');
      return;
    }
    this.error.set('');

    // Por ahora solo se muestra en la consola (F12). Cuando exista el backend, aquí se enviará.
    console.log('Ingreso listo para guardar:', {
      fecha: this.fecha, motivo: this.motivo, tipoDocumento: this.tipoDocumento,
      serie: this.serie, numeroDocumento: this.numeroDocumento,
      usuario: this.usuario, observaciones: this.observaciones, lineas,
    });
    this.router.navigate(['/entradas']);
  }
}
