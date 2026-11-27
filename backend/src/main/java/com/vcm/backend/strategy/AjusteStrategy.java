package com.vcm.backend.strategy;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.entity.Material;
import com.vcm.backend.entity.Movimiento;
import com.vcm.backend.enums.TipoMovimiento;
import com.vcm.backend.enums.TipoOperacion;
import com.vcm.backend.exception.ReglaNegocioException;
import com.vcm.backend.repository.MovimientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// En un ajuste, "cantidad" es el stock FÍSICO contado; el sistema calcula la diferencia
@Component
@RequiredArgsConstructor
public class AjusteStrategy implements OperacionStrategy {

    private final MovimientoRepository movimientoRepo;

    @Override
    public TipoOperacion tipo() {
        return TipoOperacion.AJUSTE;
    }

    @Override
    public void validar(OperacionRequest request) {
        // En los ajustes, numeroDocumento guarda el acta (ej. ACTA-014)
        if (request.numeroDocumento() == null || request.numeroDocumento().isBlank()) {
            throw new ReglaNegocioException("El número de acta es obligatorio en un ajuste");
        }
    }

    @Override
    public List<Movimiento> generarMovimientos(OperacionRequest request, ContextoOperacion contexto) {
        List<Movimiento> movimientos = new ArrayList<>();

        for (OperacionRequest.ItemRequest item : request.items()) {
            Material material = contexto.materiales().get(item.materialId());
            BigDecimal enSistema = movimientoRepo.stockDisponible(material.getId(), contexto.almacen().getId());
            BigDecimal diferencia = item.cantidad().subtract(enSistema);

            // Solo las líneas con diferencia generan movimientos
            if (diferencia.signum() == 0) {
                continue;
            }

            Movimiento m = new Movimiento();
            m.setMaterial(material);
            m.setAlmacen(contexto.almacen());
            m.setTipo(diferencia.signum() > 0 ? TipoMovimiento.AUMENTO : TipoMovimiento.DISMINUCION);
            m.setCantidad(diferencia.abs());
            m.setNota(item.nota());
            movimientos.add(m);
        }

        if (movimientos.isEmpty()) {
            throw new ReglaNegocioException(
                    "El conteo coincide con el stock del sistema: no hay diferencias que registrar");
        }
        return movimientos;
    }
}