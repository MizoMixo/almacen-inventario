package com.vcm.backend.service.impl;

import com.vcm.backend.dto.request.MaterialRequest;
import com.vcm.backend.dto.response.MaterialResponse;
import com.vcm.backend.entity.Material;
import com.vcm.backend.exception.ReglaNegocioException;
import com.vcm.backend.exception.RecursoNoEncontradoException;
import com.vcm.backend.repository.MaterialRepository;
import com.vcm.backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository repo;

    @Override
    @Transactional(readOnly = true)
    public List<MaterialResponse> listar(String q) {
        String texto = q == null ? "" : q.trim();
        return repo.buscarActivos(texto).stream().map(MaterialResponse::de).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MaterialResponse obtener(Long id) {
        return MaterialResponse.de(buscar(id));
    }

    @Override
    @Transactional
    public MaterialResponse crear(MaterialRequest r) {
        String codigo = r.codigo().trim().toUpperCase();
        if (repo.existsByCodigo(codigo)) {
            throw new ReglaNegocioException("Ya existe un material con el código " + codigo);
        }
        Material m = new Material();
        aplicar(m, r, codigo);
        return MaterialResponse.de(repo.save(m));
    }

    @Override
    @Transactional
    public MaterialResponse actualizar(Long id, MaterialRequest r) {
        Material m = buscar(id);
        String codigo = r.codigo().trim().toUpperCase();
        if (repo.existsByCodigoAndIdNot(codigo, id)) {
            throw new ReglaNegocioException("Ya existe otro material con el código " + codigo);
        }
        aplicar(m, r, codigo);
        return MaterialResponse.de(m);
    }

    // No se borra: el material puede tener movimientos. Se desactiva.
    @Override
    @Transactional
    public void desactivar(Long id) {
        buscar(id).setActivo(false);
    }

    private Material buscar(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new RecursoNoEncontradoException("Material no encontrado"));
    }

    private void aplicar(Material m, MaterialRequest r, String codigo) {
        m.setCodigo(codigo);
        m.setNombre(r.nombre().trim());
        m.setUnidadMedida(r.unidad().trim());
        m.setStockMinimo(r.stockMinimo());
    }
}
