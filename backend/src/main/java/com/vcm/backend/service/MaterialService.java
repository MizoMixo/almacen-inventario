package com.vcm.backend.service;

import com.vcm.backend.dto.request.MaterialRequest;
import com.vcm.backend.dto.response.MaterialResponse;

import java.util.List;

public interface MaterialService {

    List<MaterialResponse> listar(String q);

    MaterialResponse obtener(Long id);

    MaterialResponse crear(MaterialRequest request);

    MaterialResponse actualizar(Long id, MaterialRequest request);

    void desactivar(Long id);
}
