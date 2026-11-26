package com.vcm.backend.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
        int estado,
        String mensaje,
        Map<String, String> errores,   // errores por campo (validaciones); null si no aplica
        LocalDateTime fecha) {

    public static ErrorResponse de(int estado, String mensaje) {
        return new ErrorResponse(estado, mensaje, null, LocalDateTime.now());
    }
}
