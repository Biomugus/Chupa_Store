-- ============================================================
-- Миграция 006: начальные данные weapon_platforms
-- Зависимости: 003_weapon_platforms.sql
-- ============================================================

-- Группа AK
INSERT INTO public.weapon_platforms (name, slug, platform_group) VALUES
  ('АК / АКМ',           'ak-akm',     'AK'),
  ('АКСУ',               'aksu',       'AK'),
  ('РПК',                'rpk',        'AK'),
  ('АК-74М / Сайга-МК',  'ak74m',      'AK'),
  ('Сайга-9',            'saiga9',     'AK'),
  ('ВПО-136',            'vpo136',     'AK');

-- Группа AR
INSERT INTO public.weapon_platforms (name, slug, platform_group) VALUES
  ('AR-15',              'ar15',       'AR'),
  ('AR-10',              'ar10',       'AR');

-- Группа HK
INSERT INTO public.weapon_platforms (name, slug, platform_group) VALUES
  ('HK G3 / клоны',     'hk-g3',      'HK'),
  ('HK MP5 / клоны',    'hk-mp5',     'HK');

-- ============================================================
-- Проверка: SELECT * FROM public.weapon_platforms ORDER BY platform_group, name;
-- ============================================================
