package com.vcm.backend.service.impl;

import com.vcm.backend.dto.request.UsuarioRequest;
import com.vcm.backend.dto.response.UsuarioResponse;
import com.vcm.backend.entity.Usuario;
import com.vcm.backend.exception.ReglaNegocioException;
import com.vcm.backend.repository.UsuarioRepository;
import com.vcm.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UsuarioResponse crear(UsuarioRequest r) {
        String username = r.username().trim();
        if (repo.findByUsername(username).isPresent()) {
            throw new ReglaNegocioException("Ya existe un usuario con el nombre " + username);
        }
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPasswordHash(passwordEncoder.encode(r.password()));   // nunca se guarda en texto plano
        usuario.setNombreCompleto(r.nombreCompleto().trim());
        usuario.setRol(r.rol());
        return aRespuesta(repo.save(usuario));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repo.findAll().stream().map(this::aRespuesta).toList();
    }

    private UsuarioResponse aRespuesta(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getUsername(), u.getNombreCompleto(), u.getRol());
    }
}
