package com.vcm.backend.service;

import com.vcm.backend.dto.response.ItemCatalogoResponse;
import com.vcm.backend.dto.response.MotivoResponse;
import com.vcm.backend.dto.response.PersonalResponse;
import com.vcm.backend.enums.TipoOperacion;

import java.util.List;

public interface CatalogoService {

    List<ItemCatalogoResponse> almacenes();

    List<ItemCatalogoResponse> areas();

    List<ItemCatalogoResponse> tiposDocumento();

    List<PersonalResponse> personal();

    List<MotivoResponse> motivos(TipoOperacion tipo);
}
