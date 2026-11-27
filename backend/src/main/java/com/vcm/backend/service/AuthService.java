package com.vcm.backend.service;

import com.vcm.backend.dto.request.LoginRequest;
import com.vcm.backend.dto.response.LoginResponse;
import com.vcm.backend.dto.response.UsuarioResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    UsuarioResponse perfil(String username);
}
