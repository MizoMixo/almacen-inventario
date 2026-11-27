package com.vcm.backend.repository;

import com.vcm.backend.entity.Movimiento;
import com.vcm.backend.entity.Operacion;
import com.vcm.backend.enums.EstadoOperacion;
import com.vcm.backend.enums.TipoOperacion;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public final class OperacionSpecs {

    private OperacionSpecs() {
    }

    public static Specification<Operacion> filtrar(TipoOperacion tipo, Long almacenId,
                                                   LocalDate desde, LocalDate hasta,
                                                   EstadoOperacion estado, String q) {
        return (root, query, cb) -> {
            List<Predicate> filtros = new ArrayList<>();

            if (tipo != null) {
                filtros.add(cb.equal(root.get("tipo"), tipo));
            }
            if (estado != null) {
                filtros.add(cb.equal(root.get("estado"), estado));
            }
            if (desde != null) {
                filtros.add(cb.greaterThanOrEqualTo(root.<LocalDate>get("fecha"), desde));
            }
            if (hasta != null) {
                filtros.add(cb.lessThanOrEqualTo(root.<LocalDate>get("fecha"), hasta));
            }

            // Operaciones que tienen al menos un movimiento en ese almacén
            if (almacenId != null) {
                Subquery<Long> sub = query.subquery(Long.class);
                Root<Movimiento> m = sub.from(Movimiento.class);
                sub.select(m.<Long>get("id")).where(
                        cb.equal(m.get("operacion"), root),
                        cb.equal(m.get("almacen").get("id"), almacenId));
                filtros.add(cb.exists(sub));
            }

            // Texto: documento, serie, observaciones, N.º de operación o material
            if (q != null && !q.isBlank()) {
                String patron = "%" + q.trim().toLowerCase() + "%";

                Subquery<Long> porMaterial = query.subquery(Long.class);
                Root<Movimiento> mm = porMaterial.from(Movimiento.class);
                porMaterial.select(mm.<Long>get("id")).where(
                        cb.equal(mm.get("operacion"), root),
                        cb.or(
                                cb.like(cb.lower(mm.get("material").<String>get("codigo")), patron),
                                cb.like(cb.lower(mm.get("material").<String>get("nombre")), patron)));

                List<Predicate> alguno = new ArrayList<>();
                alguno.add(cb.like(cb.lower(root.<String>get("numeroDocumento")), patron));
                alguno.add(cb.like(cb.lower(root.<String>get("serie")), patron));
                alguno.add(cb.like(cb.lower(root.<String>get("observaciones")), patron));
                alguno.add(cb.exists(porMaterial));
                try {
                    alguno.add(cb.equal(root.get("numero"), Integer.parseInt(q.trim())));
                } catch (NumberFormatException ignorado) {
                    // el texto no es un número: se busca solo por texto
                }
                filtros.add(cb.or(alguno.toArray(Predicate[]::new)));
            }

            return cb.and(filtros.toArray(Predicate[]::new));
        };
    }
}
