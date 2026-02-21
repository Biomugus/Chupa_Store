-- ============================================================
-- Migration 004: Create product_compatibility table + enum
-- Зависимости: 003_weapon_platforms.sql
-- ============================================================

-- 1. Enum для статуса совместимости
CREATE TYPE public.compatibility_status AS ENUM (
  'perfect',                -- Подходит идеально
  'modification_required',  -- Нужен напилинг
  'incompatible'            -- Не подходит
);

-- 2. Таблица совместимости (M2M: products ↔ weapon_platforms)
CREATE TABLE IF NOT EXISTS public.product_compatibility (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES public.weapon_platforms(id) ON DELETE CASCADE,
  status public.compatibility_status NOT NULL DEFAULT 'incompatible',
  PRIMARY KEY (product_id, platform_id)
);

-- 3. Индекс для быстрого поиска совместимости по платформе
CREATE INDEX idx_compatibility_platform
  ON public.product_compatibility(platform_id);

-- 4. Включить Row Level Security
ALTER TABLE public.product_compatibility ENABLE ROW LEVEL SECURITY;

-- 5. RLS: таблица совместимости доступна всем на чтение
CREATE POLICY "Anyone can view product compatibility"
  ON public.product_compatibility FOR SELECT
  USING (true);

-- Вставка/обновление/удаление — только через Dashboard или service_role
