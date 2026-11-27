package com.vcm.backend.strategy;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.entity.Almacen;
import com.vcm.backend.entity.Material;
import com.vcm.backend.exception.ReglaNegocioException;

import java.util.Map;

// Datos ya validados y cargados desde la base, listos para que cada estrategia genere sus movimientos
public record ContextoOperacion(
        Almacen almacen,                    // almacén de la operación (puede ser null en ingresos y salidas)
        Almacen almacenDestino,
        Map<Long, Material> materiales,
        Map<Long, Almacen> almacenes        // todos los almacenes usados, por id
) {
    // Almacén de un ítem: el suyo, o el de la operación si no trae uno
    public Almacen almacenDe(OperacionRequest.ItemRequest item) {
        Long id = item.almacenId() != null ? item.almacenId() : (almacen != null ? almacen.getId() : null);
        Almacen encontrado = id == null ? null : almacenes.get(id);
        if (encontrado == null) {
            throw new ReglaNegocioException("Indica el almacén de cada material");
        }
        return encontrado;
    }
}