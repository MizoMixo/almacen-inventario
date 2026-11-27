-- DISMINUCION tiene 11 letras y la columna era VARCHAR(10)
-- Las vistas dependen de movimientos.tipo, así que se recrean

DROP VIEW v_stock_detallado;
DROP VIEW v_stock_actual;

ALTER TABLE movimientos ALTER COLUMN tipo TYPE VARCHAR(15);

CREATE VIEW v_stock_actual AS
SELECT m.material_id,
       m.almacen_id,
       SUM(CASE m.tipo WHEN 'AUMENTO' THEN m.cantidad ELSE -m.cantidad END) AS stock
FROM movimientos m
         JOIN operaciones o ON o.id = m.operacion_id
WHERE o.estado = 'ACTIVA'
GROUP BY m.material_id, m.almacen_id;

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