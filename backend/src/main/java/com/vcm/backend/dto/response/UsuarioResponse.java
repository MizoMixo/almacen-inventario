package com.vcm.backend.dto.response;

import com.vcm.backend.enums.Rol;

public record UsuarioResponse(Long id, String username, String nombreCompleto, Rol rol) {
}
