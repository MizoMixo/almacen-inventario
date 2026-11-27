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
import java.util.List;

@Component
@RequiredArgsConstructor
public class SalidaStrategy implements OperacionStrategy {

    private final MovimientoRepository movimientoRepo;

    @Override
    public TipoOperacion tipo() {
        return TipoOperacion.SALIDA;
    }

    @Override
    public void validar(OperacionRequest request) {
        if (request.areaId() == null) {
            throw new ReglaNegocioException("El área solicitante es obligatoria en una salida");
        }
        if (request.receptorId() == null) {
            throw new ReglaNegocioException("El receptor es obligatorio en una salida");
        }
    }

    @Override
    public List<Movimiento> generarMovimientos(OperacionRequest request, ContextoOperacion contexto) {
        return request.items().stream().map(item -> {
            Material material = contexto.materiales().get(item.materialId());
            BigDecimal disponible = movimientoRepo.stockDisponible(material.getId(), contexto.almacen().getId());
            if (item.cantidad().compareTo(disponible) > 0) {
                throw new ReglaNegocioException("Stock insuficiente de " + material.getCodigo() + " - "
                        + material.getNombre() + " en " + contexto.almacen().getNombre()
                        + ": disponible " + disponible.stripTrailingZeros().toPlainString()
                        + ", solicitado " + item.cantidad().stripTrailingZeros().toPlainString());
            }
            Movimiento m = new Movimiento();
            m.setMaterial(material);
            m.setAlmacen(contexto.almacen());
            m.setTipo(TipoMovimiento.DISMINUCION);
            m.setCantidad(item.cantidad());
            m.setNota(item.nota());
            return m;
        }).toList();
    }
}
