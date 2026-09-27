# Архитектура бэкенда

Отдельного бэкенда нет: серверная часть — это Next.js (Route Handlers, server actions, `proxy.ts`) и внешние сервисы.

## Route Handlers

| Эндпоинт                     | Что делает                                                                               | Лимит запросов |
| ---------------------------- | ---------------------------------------------------------------------------------------- | -------------- |
| `POST /api/orders`           | Валидирует заказ и пересылает в Telegram — [api/create-order.md](../api/create-order.md) | 5 / мин / IP   |
| `POST /api/feedback`         | Обращение с `/contacts` → Telegram — [api/feedback.md](../api/feedback.md)               | 3 / мин / IP   |
| `POST /api/suggestions/city` | Прокси к DaData для автокомплита города в чекауте                                        | 30 / мин / IP  |
| `GET /auth/callback`         | Обмен кода Supabase на сессию                                                            | —              |

Лимит запросов — фиксированное окно по IP в памяти процесса (`shared/lib/rateLimit.ts`), общий только в пределах одного инстанса.

`/api/orders` и `/api/feedback` защищены скрытым полем-ловушкой для ботов (honeypot) `website`: при непустом значении отвечают успехом, но ничего не отправляют.

## Server actions

- `src/app/(auth)/actions.ts` — логин, регистрация, OTP-подтверждение, восстановление и смена пароля, выход
- `src/modules/armory/api/updateUserPlatform.ts` — сохранение выбранной платформы в `profiles`

## proxy.ts

`src/proxy.ts` (middleware в Next 16) на каждый запрос:

- обновляет сессию Supabase через `getUser()`
- редиректит гостя с `/account`, `/reset-password` на `/login?next=…`
- редиректит залогиненного с `/login`, `/register`, `/confirm`, `/forgot-password` на `/account`
- ставит заголовки безопасности (CSP, `X-Frame-Options` и др.)

## Внешние сервисы

- **Supabase** — авторизация и таблицы `products`, `profiles`, `weapon_platforms`, `product_compatibility`. Заказы в Supabase не пишутся.
- **Telegram Bot API** — заказы и обращения (`shared/lib/telegram.ts`, env `TG_BOT_TOKEN` / `TG_CHAT_ID`)
- **DaData** — подсказки городов (env `DADATA_API_KEY`)

## Планы

Для `POST /api/orders` целевой контракт — персистентность заказов, идемпотентность по `clientRequestId`, ошибки в формате ADR 0002 (`422` с `details`, `409` при конфликте). Сейчас ничего из этого не реализовано — см. раздел «Планы» в [api/create-order.md](../api/create-order.md).
