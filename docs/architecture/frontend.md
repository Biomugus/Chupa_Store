# Архитектура фронтенда

## Стек

- Next.js 16 (App Router), React 19
- TypeScript (`strict`)
- CSS Modules + дизайн-токены (`--brand-*`) в `src/app/globals.css`
- Tailwind CSS 3 + shadcn/ui (`src/components/ui`) — примитивы: select, command, popover, dialog и др.
- Redux Toolkit — только корзина
- zod — валидация форм и API-payload
- Supabase (`@supabase/ssr`) — авторизация и данные каталога

## Маршруты

- `src/app/(main)` — витрина: главная, `catalog`, `catalog/[slug]`, `cart`, `account`, `contacts`, `constructor` (заглушка), `customs`, `history`, `mission`, `process`
- `src/app/(auth)` — `login`, `register`, `confirm` (OTP-подтверждение регистрации), `forgot-password`, `reset-password`; логика — server actions в `(auth)/actions.ts`
- `src/app/api` и `src/app/auth/callback` — см. [backend.md](backend.md)

## Структура модулей

`src/modules/*`, слои — см. [overview.md](overview.md).

| Модуль                                  | Что делает                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `cart`                                  | Корзина (Redux + localStorage), страница корзины с модалкой чекаута         |
| `checkout`                              | Форма заказа, автокомплит города, отправка в `POST /api/orders`             |
| `catalog`                               | Каталог и карточка товара из Supabase, фильтры, бейджи совместимости        |
| `armory`                                | Выбор платформы оружия в аккаунте (`WeaponSelector`, server action)         |
| `auth`                                  | zod-схемы и типы форм авторизации                                           |
| `contacts`                              | Страница `/contacts` и форма обращения                                      |
| `constructor`                           | Не используется: страница `/constructor` — заглушка, `/api/constructor` нет |
| `home`, `history`, `mission`, `process` | Контентные страницы                                                         |

## Управление состоянием

- Корзина — Redux Toolkit (`src/lib/store.ts`, единственный reducer `cart`), сохраняется в localStorage — см. [modules/cart.md](../modules/cart.md)
- Формы и сценарии — локальное состояние в хуках модулей
- Пользователь — нет общего провайдера: сервер читает сессию через `createServerClient` (`shared/api/supabase/server.ts`), клиентские компоненты (`UserMenu`, `useIsGuest`) сами вызывают `getUser()` через браузерный клиент

## Обработка ошибок

- `shared/api/httpClient.ts` при не-OK ответе бросает `ApiError` (`{ status, message, details? }`); JSON-тело в формате ADR 0002 пробрасывается как есть, иначе `message` = текст ответа. Запрос ограничен таймаутом 15 с (если вызывающий код не передал свой `signal`); сетевая ошибка и таймаут — `ApiError` со `status: 0`
- `contacts`: `details` с сервера раскладываются по полям формы
- `checkout`: показывается только `message` в баннере с повтором, серверные `details` в поля не попадают

## Тесты

- Jest + Testing Library: юнит- и компонентные тесты в `__tests__/` рядом с кодом (`cart`, `contacts`, `catalog/ProductCard`, `shared/lib`)
- Playwright настроен (`playwright.config.ts`, `e2e/`), но тестов в нём пока нет
