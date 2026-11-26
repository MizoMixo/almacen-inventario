-- V2: catálogos iniciales (tomados de las listas que ya usa el frontend)

INSERT INTO sedes (nombre) VALUES ('Sede principal');

INSERT INTO almacenes (sede_id, nombre)
SELECT id, a FROM sedes, (VALUES ('Almacén Central'), ('Almacén Campo'), ('Almacén Vichama')) AS t(a)
WHERE sedes.nombre = 'Sede principal';

INSERT INTO areas (nombre) VALUES ('Conservación'), ('Mantenimiento'), ('Administración');

INSERT INTO tipos_documento (nombre) VALUES
                                         ('Factura'), ('Boleta'), ('Guía de remisión'), ('Orden de compra'), ('Acta de donación'),
                                         ('Requerimiento'), ('Acta de entrega'), ('Vale de salida'), ('Guía interna');

INSERT INTO motivos_operacion (tipo_operacion, nombre) VALUES
                                                           ('INGRESO', 'Compra'),
                                                           ('INGRESO', 'Donación'),
                                                           ('INGRESO', 'Devolución'),
                                                           ('SALIDA', 'Consumo'),
                                                           ('SALIDA', 'Entrega a personal o área'),
                                                           ('SALIDA', 'Baja o merma'),
                                                           ('SALIDA', 'Donación'),
                                                           ('TRANSFERENCIA', 'Abastecimiento de obra / sede'),
                                                           ('TRANSFERENCIA', 'Reubicación'),
                                                           ('TRANSFERENCIA', 'Devolución a almacén central'),
                                                           ('AJUSTE', 'Regularización por diferencia física'),
                                                           ('AJUSTE', 'Carga de stock inicial'),
                                                           ('AJUSTE', 'Inventario general trimestral');