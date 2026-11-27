package com.vcm.backend.controller;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.dto.response.OperacionResponse;
import com.vcm.backend.enums.EstadoOperacion;
import com.vcm.backend.enums.TipoOperacion;
import com.vcm.backend.service.OperacionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.time.LocalDate;
import java.util.List;

@Tag(name = "Operaciones", description = "Ingresos, salidas, transferencias y ajustes")
@RestController
@RequestMapping("/api/operaciones")
@RequiredArgsConstructor
public class OperacionController {

    private final OperacionService service;

    // El usuario responsable es el dueño del token, no viene en el cuerpo
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OperacionResponse registrar(@Valid @RequestBody OperacionRequest request,
                                       Authentication authentication) {
        return service.registrar(request, authentication.getName());
    }

    // Todos los filtros son opcionales. Orden: más reciente primero
    @GetMapping
    public List<OperacionResponse> listar(
            @RequestParam(required = false) TipoOperacion tipo,
            @RequestParam(required = false) Long almacenId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false) EstadoOperacion estado,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "100") int limite) {
        return service.listar(tipo, almacenId, desde, hasta, estado, q, limite);
    }

    @GetMapping("/{id}")
    public OperacionResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PatchMapping("/{id}/anular")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public OperacionResponse anular(@PathVariable Long id) {
        return service.anular(id);
    }
}
