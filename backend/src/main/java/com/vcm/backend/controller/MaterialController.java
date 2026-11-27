package com.vcm.backend.controller;

import com.vcm.backend.dto.request.MaterialRequest;
import com.vcm.backend.dto.response.MaterialResponse;
import com.vcm.backend.service.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@Tag(name = "Materiales", description = "Catálogo de materiales")
@RestController
@RequestMapping("/api/materiales")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService service;

    @GetMapping
    public List<MaterialResponse> listar(@RequestParam(required = false) String q) {
        return service.listar(q);
    }

    @GetMapping("/{id}")
    public MaterialResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @ResponseStatus(HttpStatus.CREATED)
    public MaterialResponse crear(@Valid @RequestBody MaterialRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public MaterialResponse actualizar(@PathVariable Long id, @Valid @RequestBody MaterialRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable Long id) {
        service.desactivar(id);
    }
}
