-- 1. ordenes por dia
SELECT DATE(created_at) AS dia, COUNT(*) AS total_ordenes
FROM orders
GROUP BY DATE(created_at)
ORDER BY dia;

-- 2. facturado por dia
SELECT DATE(paid_at) AS dia, SUM(total) AS total_facturado
FROM orders
WHERE paid_at IS NOT NULL
GROUP BY DATE(paid_at)
ORDER BY dia;

-- 3. ordenes pagadas en un rango de fechas (usa ix_orders_paid_at)
SELECT id, customer_id, total, paid_at
FROM orders
WHERE paid_at >= '2026-11-01'
  AND paid_at <  '2026-12-01'
ORDER BY paid_at;
