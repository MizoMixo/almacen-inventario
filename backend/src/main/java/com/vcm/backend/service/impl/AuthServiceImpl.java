package com.vcm.backend.service.impl;

import com.vcm.backend.dto.request.LoginRequest;
import com.vcm.backend.dto.response.LoginResponse;
import com.vcm.backend.dto.response.UsuarioResponse;
import com.vcm.backend.entity.Usuario;
import com.vcm.backend.exception.CredencialesInvalidasException;
import com.vcm.backend.repository.UsuarioRepository;
import com.vcm.backend.security.JwtService;
import com.vcm.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {
        // Mismo error si el usuario no existe, está inactivo o la clave es incorrecta
        Usuario usuario = usuarioRepository.findByUsername(request.username().trim())
                .filter(Usuario::isActivo)
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(CredencialesInvalidasException::new);
        return new LoginResponse(jwtService.generar(usuario), aRespuesta(usuario));
    }

    @Override
    public UsuarioResponse perfil(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .filter(Usuario::isActivo)
                .orElseThrow(CredencialesInvalidasException::new);
        return aRespuesta(usuario);
    }

    private UsuarioResponse aRespuesta(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getUsername(), u.getNombreCompleto(), u.getRol());
    }
}
