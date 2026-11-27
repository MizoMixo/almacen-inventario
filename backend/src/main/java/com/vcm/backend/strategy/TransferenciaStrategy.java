package com.vcm.backend.strategy;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.entity.Almacen;
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

@Component
@RequiredArgsConstructor
public class TransferenciaStrategy implements OperacionStrategy {

    private final MovimientoRepository movimientoRepo;

    @Override
    public TipoOperacion tipo() {
        return TipoOperacion.TRANSFERENCIA;
    }

    @Override
    public void validar(OperacionRequest request) {
        if (request.almacenId() == null) {
            throw new ReglaNegocioException("El almacén de origen es obligatorio en una transferencia");
        }
        if (request.almacenDestinoId() == null) {
            throw new ReglaNegocioException("El almacén de destino es obligatorio en una transferencia");
        }
        if (request.almacenDestinoId().equals(request.almacenId())) {
            throw new ReglaNegocioException("El almacén de origen y el de destino no pueden ser el mismo");
        }
    }

    @Override
    public List<Movimiento> generarMovimientos(OperacionRequest request, ContextoOperacion contexto) {
        List<Movimiento> movimientos = new ArrayList<>();

        for (OperacionRequest.ItemRequest item : request.items()) {
            Material material = contexto.materiales().get(item.materialId());

            BigDecimal disponible = movimientoRepo.stockDisponible(material.getId(), contexto.almacen().getId());
            if (item.cantidad().compareTo(disponible) > 0) {
                throw new ReglaNegocioException("Stock insuficiente de " + material.getCodigo() + " - "
                        + material.getNombre() + " en " + contexto.almacen().getNombre()
                        + ": disponible " + disponible.stripTrailingZeros().toPlainString()
                        + ", solicitado " + item.cantidad().stripTrailingZeros().toPlainString());
            }

            // Sale del origen y entra al destino: 2 movimientos por material
            movimientos.add(crear(material, contexto.almacen(), TipoMovimiento.DISMINUCION, item));
            movimientos.add(crear(material, contexto.almacenDestino(), TipoMovimiento.AUMENTO, item));
        }
        return movimientos;
    }

    private Movimiento crear(Material material, Almacen almacen, TipoMovimiento tipo,
                             OperacionRequest.ItemRequest item) {
        Movimiento m = new Movimiento();
        m.setMaterial(material);
        m.setAlmacen(almacen);
        m.setTipo(tipo);
        m.setCantidad(item.cantidad());
        m.setNota(item.nota());
        return m;
    }
}
