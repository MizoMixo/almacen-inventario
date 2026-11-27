package com.vcm.backend.dto.request;

import com.vcm.backend.enums.TipoOperacion;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OperacionRequest(
        @NotNull(message = "El tipo de operación es obligatorio")
        TipoOperacion tipo,

        @NotNull(message = "La fecha es obligatoria")
        @PastOrPresent(message = "La fecha no puede ser futura")
        LocalDate fecha,

        @NotNull(message = "El motivo es obligatorio")
        Long motivoId,

        Long tipoDocumentoId,

        @Size(max = 10, message = "La serie admite hasta 10 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9-]*$", message = "La serie solo admite letras, números y guion")
        String serie,

        @Size(max = 30, message = "El número de documento admite hasta 30 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9-]*$", message = "El número de documento solo admite letras, números y guion")
        String numeroDocumento,

        @NotNull(message = "El almacén es obligatorio")
        Long almacenId,

        Long almacenDestinoId,   // solo para transferencias (se usará más adelante)

        Long areaId,
        Long receptorId,

        @Size(max = 300, message = "Las observaciones admiten hasta 300 caracteres")
        String observaciones,

        @NotEmpty(message = "Agrega al menos un material")
        @Valid
        List<ItemRequest> items
) {
    public record ItemRequest(
            @NotNull(message = "El material es obligatorio")
            Long materialId,

            @NotNull(message = "La cantidad es obligatoria")
            @DecimalMin(value = "0", message = "La cantidad no puede ser negativa")
            BigDecimal cantidad,

            @Size(max = 100, message = "La nota admite hasta 100 caracteres")
            String nota
    ) {
    }
}
