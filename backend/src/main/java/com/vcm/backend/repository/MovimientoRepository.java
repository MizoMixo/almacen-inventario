package com.vcm.backend.repository;

import com.vcm.backend.entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    // Stock de un material en un almacén, leído de la vista v_stock_actual (0 si nunca tuvo movimientos)
    @Query(value = """
            select coalesce(sum(stock), 0)
            from v_stock_actual
            where material_id = :materialId and almacen_id = :almacenId
            """, nativeQuery = true)
    BigDecimal stockDisponible(@Param("materialId") Long materialId,
                               @Param("almacenId") Long almacenId);
}
