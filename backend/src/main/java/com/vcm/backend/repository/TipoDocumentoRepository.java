package com.vcm.backend.repository;


import com.vcm.backend.entity.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Long> {

    List<TipoDocumento> findByActivoTrueOrderByNombre();
}
