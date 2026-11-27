package com.vcm.backend.dto.response;

import com.vcm.backend.entity.Operacion;
import com.vcm.backend.enums.EstadoOperacion;
import com.vcm.backend.enums.TipoOperacion;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record OperacionResponse(
        Long id,
        TipoOperacion tipo,
        Integer numero,
        LocalDate fecha,
        String motivo,
        String tipoDocumento,
        String serie,
        String numeroDocumento,
        String area,
        String receptor,
        String observaciones,
        String usuario,
        EstadoOperacion estado,
        OffsetDateTime fechaRegistro,
        List<MovimientoResponse> movimientos
) {
    public static OperacionResponse de(Operacion o) {
        return new OperacionResponse(
                o.getId(),
                o.getTipo(),
                o.getNumero(),
                o.getFecha(),
                o.getMotivo().getNombre(),
                o.getTipoDocumento() == null ? null : o.getTipoDocumento().getNombre(),
                o.getSerie(),
                o.getNumeroDocumento(),
                o.getArea() == null ? null : o.getArea().getNombre(),
                o.getReceptor() == null ? null
                        : o.getReceptor().getNombres() + " " + o.getReceptor().getApellidos(),
                o.getObservaciones(),
                o.getUsuario().getNombreCompleto(),
                o.getEstado(),
                o.getFechaRegistro(),
                o.getMovimientos().stream().map(MovimientoResponse::de).toList());
    }
}
