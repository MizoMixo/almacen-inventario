package com.vcm.backend.entity;

import com.vcm.backend.enums.EstadoOperacion;
import com.vcm.backend.enums.TipoOperacion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "operaciones")
@Getter
@Setter
@NoArgsConstructor
public class Operacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private TipoOperacion tipo;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "motivo_id")
    private MotivoOperacion motivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_documento_id")
    private TipoDocumento tipoDocumento;

    @Column(length = 10)
    private String serie;

    @Column(name = "numero_documento", length = 30)
    private String numeroDocumento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receptor_id")
    private Personal receptor;

    @Column(length = 300)
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private EstadoOperacion estado = EstadoOperacion.ACTIVA;

    @Column(name = "fecha_registro", nullable = false)
    private OffsetDateTime fechaRegistro = OffsetDateTime.now();

    @OneToMany(mappedBy = "operacion", cascade = CascadeType.ALL)
    private List<Movimiento> movimientos = new ArrayList<>();

    // Mantiene los dos lados de la relación sincronizados
    public void agregarMovimiento(Movimiento movimiento) {
        movimiento.setOperacion(this);
        movimientos.add(movimiento);
    }
}
