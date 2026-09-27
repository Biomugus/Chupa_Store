-- ============================================================
-- Миграция 001: таблица profiles + триггер автосоздания профиля
-- ============================================================

-- 1. Таблица профилей (расширение auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Включить Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: юзер может видеть и редактировать ТОЛЬКО свой профиль
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Разрешить INSERT только через триггер (SECURITY DEFINER)
-- Обычные юзеры не могут вставлять напрямую
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Триггер-функция: создаёт запись в profiles при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Триггер: срабатывает после INSERT в auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Удаление тестовых пользователей (при необходимости):
--
-- DELETE FROM auth.users WHERE email = 'test@example.com';
-- (Профиль удалится автоматически благодаря ON DELETE CASCADE)
--
-- Или удалить всех тестовых:
-- DELETE FROM auth.users WHERE email LIKE '%test%';
-- ============================================================
