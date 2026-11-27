package com.vcm.backend.dto.request;

import com.vcm.backend.enums.Rol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "El usuario es obligatorio")
        @Size(min = 3, max = 50, message = "El usuario debe tener entre 3 y 50 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "El usuario solo admite letras, números, punto, guion y guion bajo")
        String username,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, max = 72, message = "La contraseña debe tener entre 8 y 72 caracteres")
        String password,

        @NotBlank(message = "El nombre completo es obligatorio")
        @Size(max = 150, message = "El nombre admite hasta 150 caracteres")
        String nombreCompleto,

        @NotNull(message = "El rol es obligatorio")
        Rol rol
) {
}
