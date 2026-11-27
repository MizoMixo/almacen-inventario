package com.vcm.backend.service;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.dto.response.OperacionResponse;
import com.vcm.backend.enums.EstadoOperacion;
import com.vcm.backend.enums.TipoOperacion;

import java.time.LocalDate;
import java.util.List;


public interface OperacionService {

    OperacionResponse registrar(OperacionRequest request, String username);

    OperacionResponse obtener(Long id);

    List<OperacionResponse> listar(TipoOperacion tipo, Long almacenId, LocalDate desde, LocalDate hasta,
                                   EstadoOperacion estado, String q, int limite);

    OperacionResponse anular(Long id);
}
