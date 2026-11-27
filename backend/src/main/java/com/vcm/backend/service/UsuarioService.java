package com.vcm.backend.service;

import com.vcm.backend.dto.request.UsuarioRequest;
import com.vcm.backend.dto.response.UsuarioResponse;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse crear(UsuarioRequest request);

    List<UsuarioResponse> listar();
}
