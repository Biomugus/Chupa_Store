# CLAUDE.md

Этот файл — инструкции для Claude Code (claude.ai/code) по работе с кодом в этом репозитории.

## Проект

Chupa Workshop — интернет-магазин мастерской кастомных деталей для оружия.

## Команды

`npm run commit` выполняет `git add -A && cz` — перед мастером Commitizen в коммит добавляется всё, включая неотслеживаемые файлы.

Коммиты проверяются commitlint + husky (хук `commit-msg`) и должны следовать Conventional Commits (`type(scope): subject`, см. `docs/commit-convention.md`). Хук `pre-commit` запускает `lint-staged` (prettier) для файлов в индексе.

**Язык коммитов и PR:** заголовки — на английском, содержание — на русском.

- Заголовок коммита (`type(scope): subject`) и заголовок PR — на английском, например `feat(header): show name initial in user avatar`.
- Тело коммита и описание PR — на русском.
- Идентификаторы, пути к файлам и команды — как в коде.

## Архитектура

### Структура модулей (`src/modules/*`)

Бизнес-логика живёт в модулях `src/modules/*`, внутри каждого — слои по `docs/architecture/*`.

Правило границ (`docs/architecture/overview.md`): UI не обращается к API напрямую; доменная логика не импортирует React; сервисы не содержат бизнес-логики. Поток данных: `UI → Container → Domain → Service → API`.

Публичный API модуля — его `index.ts` (см. `src/modules/cart/index.ts`). Снаружи импортируйте через него, а не из внутренних файлов модуля.

### Состояние и данные

- **Корзина**: Redux Toolkit (`src/lib/store.ts` регистрирует только reducer `cart`), сохраняется в `localStorage` через `modules/cart/dal/cartStorage.ts` по ADR `docs/decisions/0001-use-localstorage-for-cart.md`. Серверной корзины нет.
- **Каталог и товары**: загружаются на сервере из Supabase (`modules/catalog/api/getCatalog.ts`) вместе с совместимостью из `product_compatibility` для выбранной пользователем платформы оружия (см. модуль `armory` и `docs/migrations/003_weapon_platforms.sql`–`007_seed_compatibility.sql`).
- **Авторизация**: Supabase, два клиента — браузерный (`shared/api/supabase/client.ts`, `createBrowserClient`) и серверный (`shared/api/supabase/server.ts`, `createServerClient` поверх `cookies()` из Next.js). Не смешивайте их: server components и server actions используют серверный клиент, клиентские компоненты — браузерный.
- **Оформление заказа**: модуль `checkout` собирает `OrderPayload` на клиенте (`model/buildOrderPayload.ts`, с `clientRequestId` из `crypto.randomUUID()`) и отправляет в `POST /api/orders`. Эндпоинт валидирует его через zod и пересылает сообщением в Telegram (env `TG_BOT_TOKEN`/`TG_CHAT_ID`) — без сохранения, без идемпотентности, ошибки отдаются обычным текстом. `docs/api/create-order.md` описывает текущее поведение; целевой контракт (сохранение, идемпотентность по `clientRequestId`, 409/422 в формате ADR 0002) — в его разделе «Планы».
- **Ошибки**: целевой формат — `{ message: string, details?: Record<string,string> }` (`ApiError` в `shared/api/apiTypes.ts`, ADR `docs/decisions/0002-api-error-format.md`). `shared/api/httpClient.ts` бросает эту структуру при не-OK ответе, чтобы хуки могли показать `details` под полями формы. Сейчас так отвечает только `/api/feedback`, `/api/orders` отвечает обычным текстом.

### Бюджет CSS

- `npm run build` после `next build` запускает `scripts/check-css-size.mjs`. Скрипт падает только с флагом `--max-total-kb <N>`, а `package.json` его пока не передаёт — поэтому сейчас он лишь печатает отчёт о размере CSS, лимит не проверяется.

### Документация

`docs/README.md` — оглавление: архитектура (`docs/architecture/`), контракты API (`docs/api/`), описания модулей (`docs/modules/`), ADR (`docs/decisions/`). Перед изменением сквозного поведения в `cart`, `checkout` или API заказов сверьтесь с нужным документом и обновите его, если изменение делает его неактуальным.

Документация пишется на русском. На английском остаются только названия технологий, идентификаторы, пути, команды и термины без устоявшегося перевода.

Изменения схемы Supabase записываются нумерованными SQL-файлами в `docs/migrations/` (пока 001–007: профили, платформы оружия, совместимость товаров, тестовые данные) и накатываются вручную через SQL Editor — Supabase CLI для миграций не используется. Журнал неполный: таблица `products` создана в Dashboard и файла миграции не имеет (см. `docs/audits/2026-09-01-supabase-audit.md`). Самое полное описание схемы, включая `products`, — сгенерированные типы `src/types/supabase.ts`. На каждое изменение схемы добавляйте новый нумерованный файл.
