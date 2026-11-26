package com.vcm.backend.repository;

import com.vcm.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);

    @Query("""
            select m from Material m
            where m.activo = true
              and (lower(m.codigo) like lower(concat('%', :q, '%'))
                   or lower(m.nombre) like lower(concat('%', :q, '%')))
            order by m.codigo
            """)
    List<Material> buscarActivos(@Param("q") String q);
}
