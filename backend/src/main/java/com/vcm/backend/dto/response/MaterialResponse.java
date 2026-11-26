package com.vcm.backend.dto.response;

import com.vcm.backend.entity.Material;
import java.math.BigDecimal;

public record MaterialResponse(
        Long id,
        String codigo,
        String nombre,
        String unidad,
        BigDecimal stockMinimo,
        boolean activo) {

    public static MaterialResponse de(Material m) {
        return new MaterialResponse(m.getId(), m.getCodigo(), m.getNombre(),
                m.getUnidadMedida(), m.getStockMinimo(), m.isActivo());
    }
}
