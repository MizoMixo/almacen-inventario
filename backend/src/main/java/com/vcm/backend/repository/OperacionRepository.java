package com.vcm.backend.repository;


import com.vcm.backend.entity.Operacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OperacionRepository extends JpaRepository<Operacion, Long>,
        JpaSpecificationExecutor<Operacion> {
}
