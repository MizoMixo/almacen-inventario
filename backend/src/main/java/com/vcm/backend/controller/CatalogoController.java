package com.vcm.backend.controller;

import com.vcm.backend.dto.response.ItemCatalogoResponse;
import com.vcm.backend.dto.response.MotivoResponse;
import com.vcm.backend.dto.response.PersonalResponse;
import com.vcm.backend.enums.TipoOperacion;
import com.vcm.backend.service.CatalogoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Catálogos", description = "Listas de apoyo: almacenes, áreas, personal, motivos y tipos de documento")
@RestController
@RequestMapping("/api/catalogos")
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoService service;

    @GetMapping("/almacenes")
    public List<ItemCatalogoResponse> almacenes() {
        return service.almacenes();
    }

    @GetMapping("/areas")
    public List<ItemCatalogoResponse> areas() {
        return service.areas();
    }

    @GetMapping("/tipos-documento")
    public List<ItemCatalogoResponse> tiposDocumento() {
        return service.tiposDocumento();
    }

    @GetMapping("/personal")
    public List<PersonalResponse> personal() {
        return service.personal();
    }

    // Opcional: ?tipo=INGRESO | SALIDA | TRANSFERENCIA | AJUSTE
    @GetMapping("/motivos")
    public List<MotivoResponse> motivos(@RequestParam(required = false) TipoOperacion tipo) {
        return service.motivos(tipo);
    }
}
