package com.vcm.backend.repository;

import com.vcm.backend.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PersonalRepository extends JpaRepository<Personal, Long> {

    @Query("""
            select p from Personal p
            left join fetch p.area
            where p.activo = true
            order by p.apellidos, p.nombres
            """)
    List<Personal> listarActivos();
}
