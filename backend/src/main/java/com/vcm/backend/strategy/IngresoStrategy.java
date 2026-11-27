package com.vcm.backend.strategy;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.entity.Movimiento;
import com.vcm.backend.enums.TipoMovimiento;
import com.vcm.backend.enums.TipoOperacion;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class IngresoStrategy implements OperacionStrategy {

    @Override
    public TipoOperacion tipo() {
        return TipoOperacion.INGRESO;
    }

    @Override
    public void validar(OperacionRequest request) {
        // El ingreso no tiene reglas adicionales
    }

    @Override
    public List<Movimiento> generarMovimientos(OperacionRequest request, ContextoOperacion contexto) {
        return request.items().stream().map(item -> {
            Movimiento m = new Movimiento();
            m.setMaterial(contexto.materiales().get(item.materialId()));
            m.setAlmacen(contexto.almacenDe(item));
            m.setTipo(TipoMovimiento.AUMENTO);
            m.setCantidad(item.cantidad());
            m.setNota(item.nota());
            return m;
        }).toList();
    }
}