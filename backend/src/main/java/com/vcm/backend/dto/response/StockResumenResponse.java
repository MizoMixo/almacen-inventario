package com.vcm.backend.dto.response;

public record StockResumenResponse(long totalMateriales, long normal, long bajo, long agotado) {
}
