# Документация проекта

## Архитектура

- [architecture/overview.md](architecture/overview.md) — слои модулей и границы между ними
- [architecture/frontend.md](architecture/frontend.md) — стек, маршруты, модули, состояние
- [architecture/backend.md](architecture/backend.md) — Route Handlers, server actions, `proxy.ts`, внешние сервисы

## API

- [api/create-order.md](api/create-order.md) — `POST /api/orders`
- [api/feedback.md](api/feedback.md) — `POST /api/feedback`

## Модули

- [modules/cart.md](modules/cart.md)
- [modules/checkout.md](modules/checkout.md)
- [modules/contacts.md](modules/contacts.md)
- [modules/notifications.md](modules/notifications.md) — уведомления о заказах и обращениях, настройка каналов

## Решения (ADR)

- [decisions/0001-use-localstorage-for-cart.md](decisions/0001-use-localstorage-for-cart.md)
- [decisions/0002-api-error-format.md](decisions/0002-api-error-format.md)
- [decisions/0003-store-orders-in-supabase.md](decisions/0003-store-orders-in-supabase.md)

## База данных

- [migrations/](migrations/) — SQL-миграции Supabase `001`–`008` (накатываются вручную через SQL Editor). Таблица `products` в них не создаётся — см. аудит ниже.

## Аудиты и тестирование

- [audits/2026-09-01-supabase-audit.md](audits/2026-09-01-supabase-audit.md) — аудит Supabase-проекта (срез на 2026-09-01)
- [test-plan-armory.md](test-plan-armory.md) — ручной тест-план «Виртуальной Оружейки»

## Коммиты

Conventional Commits с проверкой через commitlint — см. [commit-convention.md](commit-convention.md).
