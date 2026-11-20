import { Component, computed, inject, signal  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucidePlus, LucideSearch, LucideTrash, LucideX } from '@lucide/angular';

interface Material { codigo: string; nombre: string; unidad: string; }
interface Linea { material: Material; almacen: string; cantidad: number | null; }

@Component({
  selector: 'app-nueva-salida',
  imports: [FormsModule, RouterLink, LucidePlus, LucideSearch, LucideTrash, LucideX],
  templateUrl: './nueva-salida.html',
  styleUrl: './nueva-salida.css',
})

export class NuevaSalida {
  private router = inject(Router);

  // Catálogos de ejemplo (luego vendrán de la base de datos)
  motivos = ['Consumo', 'Entrega a personal o área', 'Baja o merma', 'Donación'];
  tiposDocumento = ['Sin documento', 'Requerimiento', 'Guía de remisión'];
  usuarios = ['Rony Castro', 'Ana Torres'];
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

  // Datos de la salida
  fecha = new Date().toLocaleDateString('en-CA');
  motivo = '';
  tipoDocumento = 'Sin documento';
  serie = '';
  numeroDocumento = '';
  usuario = '';
  area = '';
  receptor = '';
  observaciones = '';

  lineas = signal<Linea[]>([]);
  modalAbierto = signal(false);
  busqueda = signal('');
  error = signal('');

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
      this.error.set('Selecciona el almacén origen de cada material.');
      return;
    }
    if (lineas.some(l => !l.cantidad || l.cantidad <= 0)) {
      this.error.set('La cantidad de cada material debe ser mayor que cero.');
      return;
    }
    this.error.set('');

    // Por ahora solo se muestra en la consola (F12). Con el backend, aquí se enviará.
    console.log('Salida lista para guardar:', {
      fecha: this.fecha, motivo: this.motivo, tipoDocumento: this.tipoDocumento,
      serie: this.serie, numeroDocumento: this.numeroDocumento, usuario: this.usuario,
      area: this.area, receptor: this.receptor, observaciones: this.observaciones, lineas,
    });
    this.router.navigate(['/salidas']);
  }
}
