package com.vcm.backend.controller;

import com.vcm.backend.dto.request.LoginRequest;
import com.vcm.backend.dto.response.LoginResponse;
import com.vcm.backend.dto.response.UsuarioResponse;
import com.vcm.backend.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // Devuelve el usuario dueño del token (para la cabecera de Angular)
    @GetMapping("/me")
    public UsuarioResponse me(Authentication authentication) {
        return authService.perfil(authentication.getName());
    }
}
