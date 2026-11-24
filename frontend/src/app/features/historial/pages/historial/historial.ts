import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSearch } from '@lucide/angular';
import { Operacion, TipoOperacion } from '@shared/models/inventario';
import { Catalogos } from '@shared/services/catalogos';
import { Operaciones } from '@shared/services/operaciones';
import { DetalleOperacion } from '@shared/components/detalle-operacion/detalle-operacion';
import { COLOR_BARRA, resumenAlmacen, textoItems, titulo } from '@shared/utils/operaciones';

@Component({
  selector: 'app-historial',
  imports: [FormsModule, LucideSearch, DetalleOperacion],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial {
  private todas = inject(Operaciones).todas();
  almacenes = inject(Catalogos).almacenes;

  tipos: { valor: TipoOperacion; texto: string }[] = [
    { valor: 'INGRESO', texto: 'Ingresos' },
    { valor: 'SALIDA', texto: 'Salidas' },
    { valor: 'TRANSFERENCIA', texto: 'Transferencias' },
    { valor: 'AJUSTE', texto: 'Ajustes' },
  ];

  // Filtros
  busqueda = signal('');
  tipo = signal<'' | TipoOperacion>('');
  almacen = signal('');
  desde = signal('');
  hasta = signal('');

  seleccionada = signal<Operacion | null>(null);

  barra = COLOR_BARRA;
  titulo = titulo;
  resumenAlmacen = resumenAlmacen;
  items = textoItems;

  rangoInvalido = computed(() => !!this.desde() && !!this.hasta() && this.desde() > this.hasta());

  filas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const tipo = this.tipo();
    const almacen = this.almacen();
    const desde = this.desde();
    const hasta = this.hasta();

    return this.todas.filter((o) => {
      if (tipo && o.tipo !== tipo) return false;
      // Una transferencia coincide con su almacén de origen y con el de destino
      if (almacen && !o.movimientos.some((m) => m.almacen === almacen)) return false;
      if (desde && o.fecha < desde) return false;
      if (hasta && o.fecha > hasta) return false;
      if (texto) {
        const contenido =
          `${titulo(o)} ${o.documento} ${o.motivo} ${o.registradoPor}`.toLowerCase();
        if (!contenido.includes(texto)) return false;
      }
      return true;
    });
  });

  limpiarFiltros() {
    this.busqueda.set('');
    this.tipo.set('');
    this.almacen.set('');
    this.desde.set('');
    this.hasta.set('');
  }
}
