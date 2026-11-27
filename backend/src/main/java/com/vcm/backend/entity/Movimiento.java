package com.vcm.backend.entity;

import com.vcm.backend.enums.TipoMovimiento;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "movimientos")
@Getter
@Setter
@NoArgsConstructor
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "operacion_id")
    private Operacion operacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "almacen_id")
    private Almacen almacen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private TipoMovimiento tipo;

    @Column(nullable = false, precision = 14, scale = 4)
    private BigDecimal cantidad;

    @Column(length = 100)
    private String nota;
}
