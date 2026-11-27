package com.vcm.backend.controller;

import com.vcm.backend.dto.response.StockMaterialResponse;
import com.vcm.backend.dto.response.StockResumenResponse;
import com.vcm.backend.enums.EstadoStock;
import com.vcm.backend.service.StockService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Stock", description = "Consulta de stock calculado desde los movimientos")
@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService service;

    @GetMapping
    public List<StockMaterialResponse> consultar(@RequestParam(required = false) Long almacenId,
                                                 @RequestParam(required = false) String q,
                                                 @RequestParam(required = false) EstadoStock estado) {
        return service.consultar(almacenId, q, estado);
    }

    @GetMapping("/critico")
    public List<StockMaterialResponse> critico(@RequestParam(required = false) Long almacenId) {
        return service.critico(almacenId);
    }

    @GetMapping("/resumen")
    public StockResumenResponse resumen(@RequestParam(required = false) Long almacenId) {
        return service.resumen(almacenId);
    }
}
