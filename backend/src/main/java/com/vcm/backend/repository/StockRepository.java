package com.vcm.backend.repository;

import com.vcm.backend.entity.Movimiento;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface StockRepository extends Repository<Movimiento, Long> {

    // Materiales activos en almacenes activos, con 0 si nunca tuvieron movimientos
    @Query(value = """
            select material_id    as "materialId",
                   codigo         as "codigo",
                   material       as "material",
                   unidad_medida  as "unidadMedida",
                   stock_minimo   as "stockMinimo",
                   almacen_id     as "almacenId",
                   almacen        as "almacen",
                   stock          as "stock"
            from v_stock_detallado
            order by codigo, almacen
            """, nativeQuery = true)
    List<StockFila> listarDetallado();
}
