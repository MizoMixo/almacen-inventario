package com.vcm.backend.config;

import com.vcm.backend.entity.Usuario;
import com.vcm.backend.enums.Rol;
import com.vcm.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdministradorInicial implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:}")
    private String username;

    @Value("${app.admin.password:}")
    private String password;

    @Value("${app.admin.nombre:Administrador}")
    private String nombre;

    @Override
    public void run(ApplicationArguments args) {
        if (usuarioRepository.count() > 0) {
            return;
        }
        if (username.isBlank() || password.length() < 8) {
            log.warn("No hay usuarios y falta app.admin.username o app.admin.password (mínimo 8 caracteres). No se creó el administrador.");
            return;
        }
        Usuario admin = new Usuario();
        admin.setUsername(username.trim());
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setNombreCompleto(nombre);
        admin.setRol(Rol.ADMINISTRADOR);
        usuarioRepository.save(admin);
        log.info("Administrador inicial '{}' creado.", username);
    }
}
