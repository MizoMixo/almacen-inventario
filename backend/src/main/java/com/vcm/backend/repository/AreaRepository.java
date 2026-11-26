package com.vcm.backend.repository;

import com.vcm.backend.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AreaRepository extends JpaRepository<Area, Long> {

    List<Area> findByActivoTrueOrderByNombre();
}
