-- ============================================================
-- Migration 007: Seed product_compatibility for testing
-- Зависимости: 004_product_compatibility.sql, 006_seed_platforms.sql
-- ============================================================

INSERT INTO public.product_compatibility (product_id, platform_id, status)
SELECT p.id, w.id, v.status::compatibility_status
FROM (VALUES
  -- Цевье "Упор"
  ('Цевье "Упор"', 'ak-akm',  'perfect'),
  ('Цевье "Упор"', 'ak74m',   'perfect'),
  ('Цевье "Упор"', 'vpo136',  'perfect'),
  ('Цевье "Упор"', 'aksu',    'modification_required'),
  ('Цевье "Упор"', 'rpk',     'modification_required'),
  ('Цевье "Упор"', 'ar15',    'incompatible'),
  ('Цевье "Упор"', 'hk-g3',   'incompatible'),

  -- Цевье "Румын"
  ('Цевье "Румын"', 'ak-akm',  'perfect'),
  ('Цевье "Румын"', 'ak74m',   'perfect'),
  ('Цевье "Румын"', 'vpo136',  'perfect'),
  ('Цевье "Румын"', 'aksu',    'modification_required'),
  ('Цевье "Румын"', 'rpk',     'perfect'),
  ('Цевье "Румын"', 'ar15',    'incompatible'),
  ('Цевье "Румын"', 'hk-g3',   'incompatible'),

  -- Цевье "Укорот"
  ('Цевье "Укорот"', 'ak-akm',  'modification_required'),
  ('Цевье "Укорот"', 'ak74m',   'modification_required'),
  ('Цевье "Укорот"', 'aksu',    'perfect'),
  ('Цевье "Укорот"', 'vpo136',  'modification_required'),
  ('Цевье "Укорот"', 'rpk',     'incompatible'),
  ('Цевье "Укорот"', 'ar15',    'incompatible'),

  -- Цевье "База"
  ('Цевье "База"', 'ak-akm',  'perfect'),
  ('Цевье "База"', 'ak74m',   'perfect'),
  ('Цевье "База"', 'vpo136',  'perfect'),
  ('Цевье "База"', 'aksu',    'modification_required'),
  ('Цевье "База"', 'rpk',     'perfect'),
  ('Цевье "База"', 'saiga9',  'modification_required'),
  ('Цевье "База"', 'ar15',    'incompatible'),
  ('Цевье "База"', 'hk-g3',   'incompatible')
) AS v(product_title, platform_slug, status)
JOIN public.products p ON p.title = v.product_title
JOIN public.weapon_platforms w ON w.slug = v.platform_slug;

-- ============================================================
-- Проверка:
-- SELECT p.title, w.name, pc.status
-- FROM product_compatibility pc
-- JOIN products p ON p.id = pc.product_id
-- JOIN weapon_platforms w ON w.id = pc.platform_id
-- ORDER BY p.title, w.platform_group, w.name;
-- ============================================================
