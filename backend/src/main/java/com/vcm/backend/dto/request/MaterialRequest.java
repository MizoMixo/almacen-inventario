package com.vcm.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MaterialRequest(
        @NotBlank @Size(max = 20) String codigo,
        @NotBlank @Size(max = 150) String nombre,
        @NotBlank @Size(max = 20) String unidad,
        @NotNull @PositiveOrZero BigDecimal stockMinimo) {
}
