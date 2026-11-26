package com.vcm.backend.repository;

import com.vcm.backend.entity.Almacen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlmacenRepository extends JpaRepository<Almacen, Long> {

    List<Almacen> findByActivoTrueOrderByNombre();
}
