package com.vcm.backend.repository;

import com.vcm.backend.entity.SecuenciaOperacion;
import com.vcm.backend.enums.TipoOperacion;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SecuenciaOperacionRepository extends JpaRepository<SecuenciaOperacion, TipoOperacion> {

    // Bloquea la fila hasta que termine la transacción: dos registros a la vez no obtienen el mismo número
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from SecuenciaOperacion s where s.tipo = :tipo")
    Optional<SecuenciaOperacion> bloquearPorTipo(@Param("tipo") TipoOperacion tipo);
}
