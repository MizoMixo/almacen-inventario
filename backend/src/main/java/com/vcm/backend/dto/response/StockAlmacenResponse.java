package com.vcm.backend.dto.response;

import java.math.BigDecimal;

public record StockAlmacenResponse(Long almacenId, String almacen, BigDecimal stock) {
}
