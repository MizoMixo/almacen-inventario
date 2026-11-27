package com.vcm.backend.entity;

import com.vcm.backend.enums.TipoOperacion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "secuencias_operacion")
@Getter
@Setter
@NoArgsConstructor
public class SecuenciaOperacion {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private TipoOperacion tipo;

    @Column(name = "ultimo_numero", nullable = false)
    private int ultimoNumero;
}
