package com.vcm.backend.dto.response;

public record LoginResponse(String token, UsuarioResponse usuario) {
}
