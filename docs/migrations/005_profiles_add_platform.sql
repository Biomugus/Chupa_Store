-- ============================================================
-- Миграция 005: поле selected_platform_id в profiles
-- Зависимости: 003_weapon_platforms.sql
-- ============================================================

-- 1. Добавить поле выбранной платформы в профиль
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS selected_platform_id UUID
  REFERENCES public.weapon_platforms(id) ON DELETE SET NULL;

-- Примечание по RLS:
-- Существующие политики из 001_create_profiles.sql уже покрывают этот кейс:
--   "Users can view own profile"  → SELECT WHERE auth.uid() = id
--   "Users can update own profile" → UPDATE WHERE auth.uid() = id
-- Новое поле selected_platform_id автоматически попадает под эти политики.
-- Юзер может обновить selected_platform_id только в СВОЕЙ записи profiles.
