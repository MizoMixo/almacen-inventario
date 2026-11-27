package com.vcm.backend.dto.response;

import com.vcm.backend.entity.Movimiento;
import com.vcm.backend.enums.TipoMovimiento;

import java.math.BigDecimal;

public record MovimientoResponse(
        Long materialId,
        String codigo,
        String material,
        String unidadMedida,
        Long almacenId,
        String almacen,
        TipoMovimiento tipo,
        BigDecimal cantidad,
        String nota
) {
    public static MovimientoResponse de(Movimiento m) {
        return new MovimientoResponse(
                m.getMaterial().getId(),
                m.getMaterial().getCodigo(),
                m.getMaterial().getNombre(),
                m.getMaterial().getUnidadMedida(),
                m.getAlmacen().getId(),
                m.getAlmacen().getNombre(),
                m.getTipo(),
                m.getCantidad(),
                m.getNota());
    }
}
