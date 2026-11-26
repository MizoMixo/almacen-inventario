package com.vcm.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI().info(new Info()
                .title("API del Sistema de Gestión de Almacén e Inventario")
                .version("1.0.0")
                .description("Materiales, operaciones (ingresos, salidas, transferencias y ajustes) y stock"));
    }
}
