-- ============================================================
-- Sistema Web de Gestión de Almacén e Inventario
-- V1: estructura de tablas y vistas
-- ============================================================

-- ---------- Catálogos ----------
CREATE TABLE sedes (
                       id      BIGSERIAL PRIMARY KEY,
                       nombre  VARCHAR(100) NOT NULL UNIQUE,
                       activo  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE almacenes (
                           id       BIGSERIAL PRIMARY KEY,
                           sede_id  BIGINT NOT NULL REFERENCES sedes(id),
                           nombre   VARCHAR(100) NOT NULL UNIQUE,
                           activo   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE areas (
                       id      BIGSERIAL PRIMARY KEY,
                       nombre  VARCHAR(100) NOT NULL UNIQUE,
                       activo  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE personal (
                          id         BIGSERIAL PRIMARY KEY,
                          dni        VARCHAR(8) NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{8}$'),
    nombres    VARCHAR(100) NOT NULL,
    apellidos  VARCHAR(100) NOT NULL,
    area_id    BIGINT REFERENCES areas(id),
    activo     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE materiales (
                            id             BIGSERIAL PRIMARY KEY,
                            codigo         VARCHAR(20) NOT NULL UNIQUE,
                            nombre         VARCHAR(150) NOT NULL,
                            unidad_medida  VARCHAR(20) NOT NULL,                 -- una sola unidad por material
                            stock_minimo   NUMERIC(14,4) NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
                            activo         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tipos_documento (
                                 id      BIGSERIAL PRIMARY KEY,
                                 nombre  VARCHAR(80) NOT NULL UNIQUE,
                                 activo  BOOLEAN NOT NULL DEFAULT TRUE
);

-- Los "tipos de ajuste" (regularización, stock inicial, conteo general) son motivos de tipo AJUSTE
CREATE TABLE motivos_operacion (
                                   id               BIGSERIAL PRIMARY KEY,
                                   tipo_operacion   VARCHAR(15) NOT NULL
                                       CHECK (tipo_operacion IN ('INGRESO','SALIDA','TRANSFERENCIA','AJUSTE')),
                                   nombre           VARCHAR(100) NOT NULL,
                                   activo           BOOLEAN NOT NULL DEFAULT TRUE,
                                   UNIQUE (tipo_operacion, nombre)
);

CREATE TABLE usuarios (
                          id               BIGSERIAL PRIMARY KEY,
                          username         VARCHAR(50) NOT NULL UNIQUE,
                          password_hash    VARCHAR(100) NOT NULL,              -- contraseña cifrada (BCrypt), nunca en texto plano
                          nombre_completo  VARCHAR(150) NOT NULL,
                          rol              VARCHAR(20) NOT NULL CHECK (rol IN ('ADMINISTRADOR','ALMACENERO')),
                          activo           BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------- Numeración propia por tipo de operación ----------
CREATE TABLE secuencias_operacion (
                                      tipo            VARCHAR(15) PRIMARY KEY
                                          CHECK (tipo IN ('INGRESO','SALIDA','TRANSFERENCIA','AJUSTE')),
                                      ultimo_numero   INTEGER NOT NULL DEFAULT 0 CHECK (ultimo_numero >= 0)
);

INSERT INTO secuencias_operacion (tipo) VALUES ('INGRESO'), ('SALIDA'), ('TRANSFERENCIA'), ('AJUSTE');

-- ---------- Núcleo: operaciones y movimientos ----------
CREATE TABLE operaciones (
                             id                  BIGSERIAL PRIMARY KEY,
                             tipo                VARCHAR(15) NOT NULL
                                 CHECK (tipo IN ('INGRESO','SALIDA','TRANSFERENCIA','AJUSTE')),
                             numero              INTEGER NOT NULL CHECK (numero > 0),   -- N.º dentro de su tipo
                             fecha               DATE NOT NULL,
                             motivo_id           BIGINT NOT NULL REFERENCES motivos_operacion(id),
                             tipo_documento_id   BIGINT REFERENCES tipos_documento(id),
                             serie               VARCHAR(10),
                             numero_documento    VARCHAR(30),                           -- en ajustes guarda el acta (ej. ACTA-014)
                             area_id             BIGINT REFERENCES areas(id),           -- área solicitante (salidas)
                             receptor_id         BIGINT REFERENCES personal(id),        -- quien recibe (salidas)
                             observaciones       VARCHAR(300),
                             usuario_id          BIGINT NOT NULL REFERENCES usuarios(id),
                             estado              VARCHAR(10) NOT NULL DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA','ANULADA')),
                             fecha_registro      TIMESTAMPTZ NOT NULL DEFAULT now(),
                             UNIQUE (tipo, numero)
);

CREATE TABLE movimientos (
                             id            BIGSERIAL PRIMARY KEY,
                             operacion_id  BIGINT NOT NULL REFERENCES operaciones(id),
                             material_id   BIGINT NOT NULL REFERENCES materiales(id),
                             almacen_id    BIGINT NOT NULL REFERENCES almacenes(id),
                             tipo          VARCHAR(10) NOT NULL CHECK (tipo IN ('AUMENTO','DISMINUCION')),
                             cantidad      NUMERIC(14,4) NOT NULL CHECK (cantidad > 0),  -- RF12: siempre mayor que cero
                             nota          VARCHAR(100)                                   -- nota por ítem (ajustes)
);

CREATE INDEX idx_operaciones_tipo_fecha ON operaciones (tipo, fecha DESC);
CREATE INDEX idx_movimientos_operacion  ON movimientos (operacion_id);
CREATE INDEX idx_movimientos_stock      ON movimientos (material_id, almacen_id);

-- ---------- Stock: se calcula, no se guarda ----------
-- Suma los aumentos y resta las disminuciones de las operaciones ACTIVAS
CREATE VIEW v_stock_actual AS
SELECT m.material_id,
       m.almacen_id,
       SUM(CASE m.tipo WHEN 'AUMENTO' THEN m.cantidad ELSE -m.cantidad END) AS stock
FROM movimientos m
         JOIN operaciones o ON o.id = m.operacion_id
WHERE o.estado = 'ACTIVA'
GROUP BY m.material_id, m.almacen_id;

-- Todos los materiales activos en todos los almacenes activos (con 0 si nunca tuvieron movimientos)
CREATE VIEW v_stock_detallado AS
SELECT ma.id            AS material_id,
       ma.codigo,
       ma.nombre        AS material,
       ma.unidad_medida,
       ma.stock_minimo,
       al.id            AS almacen_id,
       al.nombre        AS almacen,
       COALESCE(s.stock, 0) AS stock
FROM materiales ma
         CROSS JOIN almacenes al
         LEFT JOIN v_stock_actual s ON s.material_id = ma.id AND s.almacen_id = al.id
WHERE ma.activo AND al.activo;