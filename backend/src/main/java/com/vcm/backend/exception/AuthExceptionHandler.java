package com.vcm.backend.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Maneja el error 401 del login. Tiene prioridad máxima para no depender del manejador general.
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthExceptionHandler {

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<Map<String, Object>> credenciales(CredencialesInvalidasException ex) {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("estado", 401);
        cuerpo.put("mensaje", ex.getMessage());
        cuerpo.put("fecha", LocalDateTime.now().toString());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(cuerpo);
    }
}
