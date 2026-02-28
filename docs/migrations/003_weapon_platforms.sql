-- ============================================================
-- Migration 003: Create weapon_platforms table
-- ============================================================

-- 1. Справочник подплатформ оружия
-- platform_group привязывает подплатформу к фильтру каталога
-- (значения: 'AK', 'AR', 'HK', 'others' — из filterOptions.ts)
CREATE TABLE IF NOT EXISTS public.weapon_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  platform_group TEXT NOT NULL
);

-- 2. Включить Row Level Security
ALTER TABLE public.weapon_platforms ENABLE ROW LEVEL SECURITY;

-- 3. RLS: справочник доступен всем на чтение (включая anon)
CREATE POLICY "Anyone can view weapon platforms"
  ON public.weapon_platforms FOR SELECT
  USING (true);

-- Вставка/обновление/удаление — только через Dashboard или service_role
-- Обычные юзеры НЕ могут менять справочник
