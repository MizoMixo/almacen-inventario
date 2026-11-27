package com.vcm.backend.strategy;

import com.vcm.backend.entity.Almacen;
import com.vcm.backend.entity.Material;

import java.util.Map;

// Datos ya validados y cargados desde la base, listos para que cada estrategia genere sus movimientos
public record ContextoOperacion(
        Almacen almacen,
        Almacen almacenDestino,
        Map<Long, Material> materiales
) {
}
