import { Component, computed, input, output, signal } from '@angular/core';
import { LucideSearch, LucideX } from '@lucide/angular';
import { Material } from '@shared/models/inventario';

@Component({
  selector: 'app-buscador-materiales',
  imports: [LucideSearch, LucideX],
  templateUrl: './buscador-materiales.html',
  styleUrl: './buscador-materiales.css',
})
export class BuscadorMateriales {
  // Lo que la pantalla le pasa
  titulo = input('Buscar material');
  materiales = input.required<Material[]>(); // materiales candidatos
  seleccionados = input<string[]>([]); // códigos ya agregados
  detalle = input<(m: Material) => string>((m) => `${m.codigo} · ${m.unidad}`); // texto gris bajo el nombre

  // Lo que le avisa a la pantalla
  agregar = output<Material>();
  cerrar = output<void>();

  busqueda = signal('');

  resultados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    return this.materiales().filter(
      (m) => m.codigo.toLowerCase().includes(texto) || m.nombre.toLowerCase().includes(texto),
    );
  });

  yaAgregado(m: Material) {
    return this.seleccionados().includes(m.codigo);
  }
}
