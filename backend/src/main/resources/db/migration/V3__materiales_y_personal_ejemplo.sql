-- V3: materiales y personal de ejemplo (los 6 materiales del frontend + 9 más)

INSERT INTO materiales (codigo, nombre, unidad_medida, stock_minimo) VALUES
                                                                         ('MAT-001', 'Cemento Portland Tipo I',     'bls', 10),
                                                                         ('MAT-002', 'Brocha de cerda 2"',          'und', 5),
                                                                         ('MAT-003', 'Bolsa polietileno 10x15',     'und', 50),
                                                                         ('MAT-004', 'Tubo PVC SAP 1/2"',           'und', 10),
                                                                         ('MAT-005', 'Pintura látex blanco 4L',     'gal', 4),
                                                                         ('MAT-006', 'Guantes de seguridad nitrilo','par', 20),
                                                                         ('MAT-007', 'Clavos de 3"',                'kg',  5),
                                                                         ('MAT-008', 'Alambre N.º 16',              'kg',  5),
                                                                         ('MAT-009', 'Lija de agua N.º 120',        'und', 20),
                                                                         ('MAT-010', 'Thinner acrílico',            'gal', 3),
                                                                         ('MAT-011', 'Cinta aislante',              'und', 10),
                                                                         ('MAT-012', 'Casco de seguridad',          'und', 5),
                                                                         ('MAT-013', 'Manguera de jardín 1/2"',     'm',   30),
                                                                         ('MAT-014', 'Foco LED 12W',                'und', 15),
                                                                         ('MAT-015', 'Escoba de cerdas',            'und', 5);

INSERT INTO personal (dni, nombres, apellidos, area_id)
SELECT t.dni, t.nombres, t.apellidos, a.id
FROM (VALUES
          ('45123678', 'Luis',   'Rojas',   'Mantenimiento'),
          ('46234789', 'María',  'Quispe',  'Conservación'),
          ('47345890', 'Carlos', 'Vega',    'Administración')
     ) AS t(dni, nombres, apellidos, area)
         JOIN areas a ON a.nombre = t.area;