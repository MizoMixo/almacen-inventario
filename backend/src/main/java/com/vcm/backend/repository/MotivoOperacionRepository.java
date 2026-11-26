package com.vcm.backend.repository;

import com.vcm.backend.entity.MotivoOperacion;
import com.vcm.backend.enums.TipoOperacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MotivoOperacionRepository extends JpaRepository<MotivoOperacion, Long> {

    List<MotivoOperacion> findByActivoTrueOrderById();

    List<MotivoOperacion> findByTipoOperacionAndActivoTrueOrderById(TipoOperacion tipoOperacion);
}
