package com.vcm.backend.strategy;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.entity.Movimiento;
import com.vcm.backend.enums.TipoOperacion;

import java.util.List;

public interface OperacionStrategy {

    TipoOperacion tipo();

    // Reglas propias del tipo de operación (campos obligatorios, etc.)
    void validar(OperacionRequest request);

    // Convierte los ítems de la operación en movimientos de stock
    List<Movimiento> generarMovimientos(OperacionRequest request, ContextoOperacion contexto);
}
