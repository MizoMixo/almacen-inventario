package com.vcm.backend.service.impl;

import com.vcm.backend.dto.response.StockAlmacenResponse;
import com.vcm.backend.dto.response.StockMaterialResponse;
import com.vcm.backend.dto.response.StockResumenResponse;
import com.vcm.backend.enums.EstadoStock;
import com.vcm.backend.repository.StockFila;
import com.vcm.backend.repository.StockRepository;
import com.vcm.backend.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StockServiceImpl implements StockService {

    private final StockRepository repo;

    @Override
    public List<StockMaterialResponse> consultar(Long almacenId, String q, EstadoStock estado) {
        String texto = q == null ? "" : q.trim().toLowerCase();
        return armar(almacenId).stream()
                .filter(s -> estado == null || s.estado() == estado)
                .filter(s -> texto.isEmpty()
                        || s.codigo().toLowerCase().contains(texto)
                        || s.material().toLowerCase().contains(texto))
                .toList();
    }

    @Override
    public List<StockMaterialResponse> critico(Long almacenId) {
        return armar(almacenId).stream()
                .filter(s -> s.estado() != EstadoStock.NORMAL)
                .toList();
    }

    @Override
    public StockResumenResponse resumen(Long almacenId) {
        List<StockMaterialResponse> todos = armar(almacenId);
        return new StockResumenResponse(
                todos.size(),
                contar(todos, EstadoStock.NORMAL),
                contar(todos, EstadoStock.BAJO),
                contar(todos, EstadoStock.AGOTADO));
    }

    private long contar(List<StockMaterialResponse> lista, EstadoStock estado) {
        return lista.stream().filter(s -> s.estado() == estado).count();
    }

    // Agrupa las filas (material x almacén) en un resultado por material con su desglose
    private List<StockMaterialResponse> armar(Long almacenId) {
        Map<Long, List<StockFila>> porMaterial = new LinkedHashMap<>();
        for (StockFila fila : repo.listarDetallado()) {
            if (almacenId != null && !almacenId.equals(fila.getAlmacenId())) {
                continue;
            }
            porMaterial.computeIfAbsent(fila.getMaterialId(), k -> new ArrayList<>()).add(fila);
        }

        List<StockMaterialResponse> resultado = new ArrayList<>();
        for (List<StockFila> filas : porMaterial.values()) {
            StockFila primera = filas.get(0);
            BigDecimal total = filas.stream().map(StockFila::getStock)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            List<StockAlmacenResponse> almacenes = filas.stream()
                    .map(f -> new StockAlmacenResponse(f.getAlmacenId(), f.getAlmacen(), f.getStock()))
                    .toList();
            resultado.add(new StockMaterialResponse(
                    primera.getMaterialId(), primera.getCodigo(), primera.getMaterial(),
                    primera.getUnidadMedida(), primera.getStockMinimo(),
                    total, estadoDe(total, primera.getStockMinimo()), almacenes));
        }
        return resultado;
    }

    private EstadoStock estadoDe(BigDecimal total, BigDecimal minimo) {
        if (total.signum() <= 0) {
            return EstadoStock.AGOTADO;
        }
        return total.compareTo(minimo) <= 0 ? EstadoStock.BAJO : EstadoStock.NORMAL;
    }
}
