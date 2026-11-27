package com.vcm.backend.repository;

import java.math.BigDecimal;

// Una fila de v_stock_detallado: un material en un almacén
public interface StockFila {
    Long getMaterialId();
    String getCodigo();
    String getMaterial();
    String getUnidadMedida();
    BigDecimal getStockMinimo();
    Long getAlmacenId();
    String getAlmacen();
    BigDecimal getStock();
}
