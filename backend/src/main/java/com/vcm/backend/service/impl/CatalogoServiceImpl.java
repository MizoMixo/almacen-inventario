package com.vcm.backend.service.impl;

import com.vcm.backend.dto.response.ItemCatalogoResponse;
import com.vcm.backend.dto.response.MotivoResponse;
import com.vcm.backend.dto.response.PersonalResponse;
import com.vcm.backend.entity.MotivoOperacion;
import com.vcm.backend.entity.Personal;
import com.vcm.backend.enums.TipoOperacion;
import com.vcm.backend.repository.*;
import com.vcm.backend.service.CatalogoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogoServiceImpl implements CatalogoService {

    private final AlmacenRepository almacenRepo;
    private final AreaRepository areaRepo;
    private final TipoDocumentoRepository tipoDocumentoRepo;
    private final PersonalRepository personalRepo;
    private final MotivoOperacionRepository motivoRepo;

    @Override
    public List<ItemCatalogoResponse> almacenes() {
        return almacenRepo.findByActivoTrueOrderByNombre().stream()
                .map(a -> new ItemCatalogoResponse(a.getId(), a.getNombre())).toList();
    }

    @Override
    public List<ItemCatalogoResponse> areas() {
        return areaRepo.findByActivoTrueOrderByNombre().stream()
                .map(a -> new ItemCatalogoResponse(a.getId(), a.getNombre())).toList();
    }

    @Override
    public List<ItemCatalogoResponse> tiposDocumento() {
        return tipoDocumentoRepo.findByActivoTrueOrderByNombre().stream()
                .map(t -> new ItemCatalogoResponse(t.getId(), t.getNombre())).toList();
    }

    @Override
    public List<PersonalResponse> personal() {
        return personalRepo.listarActivos().stream().map(this::aRespuesta).toList();
    }

    @Override
    public List<MotivoResponse> motivos(TipoOperacion tipo) {
        List<MotivoOperacion> motivos = (tipo == null)
                ? motivoRepo.findByActivoTrueOrderById()
                : motivoRepo.findByTipoOperacionAndActivoTrueOrderById(tipo);
        return motivos.stream()
                .map(m -> new MotivoResponse(m.getId(), m.getNombre(), m.getTipoOperacion())).toList();
    }

    private PersonalResponse aRespuesta(Personal p) {
        return new PersonalResponse(
                p.getId(),
                p.getDni(),
                p.getNombres() + " " + p.getApellidos(),
                p.getArea() == null ? null : p.getArea().getId(),
                p.getArea() == null ? null : p.getArea().getNombre());
    }
}
