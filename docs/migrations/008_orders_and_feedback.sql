-- ============================================================
-- Миграция 008: таблицы orders и feedback_requests
-- Заказы и обращения с сайта сохраняются в БД до отправки
-- уведомлений (Telegram, VK, почта) — см. ADR 0003.
-- ============================================================

-- 1. Статус обработки заявки (общий для заказов и обращений)
CREATE TYPE public.request_status AS ENUM (
  'new',          -- Только поступила
  'in_progress',  -- В работе
  'done',         -- Выполнена
  'cancelled'     -- Отменена
);

-- 2. Заказы из корзины (POST /api/orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- clientRequestId из OrderPayload: повтор с тем же id не создаёт дубль
  client_request_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.request_status NOT NULL DEFAULT 'new',
  -- { fullName, phone, contactMethod, contactValue, location }
  customer JSONB NOT NULL,
  delivery_service TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  -- [{ id, title, price, quantity }] — снимок корзины на момент заказа
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  -- Результат по каналам: { "telegram": "ok", "vk": "failed", "email": "skipped" }
  notifications JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- 3. Обращения с формы /contacts (POST /api/feedback)
CREATE TABLE IF NOT EXISTS public.feedback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.request_status NOT NULL DEFAULT 'new',
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  notifications JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_feedback_requests_created_at ON public.feedback_requests(created_at DESC);

-- 4. Включить Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_requests ENABLE ROW LEVEL SECURITY;

-- Политик нет намеренно: anon и authenticated не могут ни читать, ни писать.
-- Запись — только с сервера через service_role (shared/api/supabase/admin.ts),
-- просмотр и смена статуса — через Dashboard → Table Editor.
