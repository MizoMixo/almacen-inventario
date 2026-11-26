package com.vcm.backend.dto.response;

import com.vcm.backend.enums.TipoOperacion;
public record MotivoResponse(Long id, String nombre, TipoOperacion tipoOperacion) {
}
