package com.vcm.backend.dto.response;

import com.vcm.backend.enums.EstadoStock;

import java.math.BigDecimal;
import java.util.List;

public record StockMaterialResponse(
        Long materialId,
        String codigo,
        String material,
        String unidadMedida,
        BigDecimal stockMinimo,
        BigDecimal stockTotal,
        EstadoStock estado,
        List<StockAlmacenResponse> almacenes
) {
}