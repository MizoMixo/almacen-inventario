package com.vcm.backend.service;

import com.vcm.backend.dto.response.StockMaterialResponse;
import com.vcm.backend.dto.response.StockResumenResponse;
import com.vcm.backend.enums.EstadoStock;

import java.util.List;

public interface StockService {

    List<StockMaterialResponse> consultar(Long almacenId, String q, EstadoStock estado);

    // Materiales AGOTADO o BAJO (el "stock crítico" de Inicio)
    List<StockMaterialResponse> critico(Long almacenId);

    StockResumenResponse resumen(Long almacenId);
}