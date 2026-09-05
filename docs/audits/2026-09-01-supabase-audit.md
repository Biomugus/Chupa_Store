# Full Supabase Project Audit — Chupa Workshop

**Дата:** 2026-09-01
**Метод:** аудит репозитория (`docs/migrations/*.sql`, `src/types/supabase.ts`, клиентский/серверный код, `.env.local`) + прямая live-проверка через Supabase Dashboard (`supabase.com/dashboard/project/yqrzyclyresdrbiwnfsx`) через SQL Editor (read-only `SELECT` по `information_schema`, `pg_constraint`, `pg_indexes`, `pg_policies`, `pg_proc`/`pg_trigger`), страницы Database → Policies, Auth → Sign In/Providers, Auth → Attack Protection, Auth → Rate Limits. Никаких изменений в схеме/RLS/Auth/коде в ходе аудита не вносилось.

---

## Executive Summary

Архитектура компактная и для текущего масштаба (небольшой каталог, простая авторизация, «арсенал» пользователя) сделана аккуратно: разделение browser/server клиентов, `getUser()` вместо `getSession()` в middleware, RLS с `auth.uid()` на всех пользовательских таблицах, отсутствие `service_role` на клиенте. Живая проверка это подтвердила: политики RLS в БД дословно совпадают с тем, что описано в миграциях репозитория — дрифта в самих политиках нет.

Главная системная проблема — не в Supabase, а вокруг него: **endpoint создания заказов (`POST /api/orders`) вообще не использует Supabase** — нет таблицы `orders`, нет персистентности, нет идемпотентности, хотя `docs/api/create-order.md` описывает именно это как контракт. Заказ сейчас — это письмо в Telegram с данными, которые не перепроверяются на сервере (включая `price`/`total` от клиента).

Вторая системная проблема — **процесс миграций сломан на практике, не только теоретически**. Dashboard прямым текстом показывает: **"Last migration: No migrations"**, **"Last backup: No backups"**. Это не гипотеза — миграции из `docs/migrations/` никогда не прогонялись через Supabase Migration tooling; вся схема накатана вручную через SQL Editor (история сохранённых запросов в Dashboard прямо это подтверждает — `"Products table with public read access"`, `"Auto-create profiles on user insert"`, `"AK handguard product inserts"` и т.д., ни один из которых не оформлен как файл миграции в git). Отсюда и главный конкретный симптом: таблица `products` — единственная в проекте, для которой в репозитории нет create-миграции, хотя две другие миграции (`004`, `007`) на неё ссылаются.

RLS для `products` при этом жива и корректна (`SELECT` для всех, `qual = true`, никаких mutating-политик) — но, как выяснилось при проверке живых `pg_proc`/`pg_trigger`, это не заслуга дисциплины разработчика, а срабатывание платформенного safety-net: в проекте есть недокументированная функция `public.rls_auto_enable()` (`SECURITY DEFINER`, event trigger на `CREATE TABLE` в схеме `public`), которая автоматически включает RLS на каждой новой таблице. Это надёжно для схемы `public`, но означает, что защита RLS сейчас держится не на процессе, а на неявном платформенном механизме, о котором никто в команде, судя по документации, не знает.

Оценки:

| Критерий             | Оценка | Обоснование                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture         | 6/10   | Модульная граница `UI → Container → Domain → Service → API` соблюдается для того, что реализовано, но заказы — не Supabase-flow, хотя должны быть                                                                                                                                                                                              |
| Database design      | 5/10   | То, что есть (`profiles`, `weapon_platforms`, `product_compatibility`) — нормализовано и корректно; но `products` не отслеживается миграциями, и это подтверждено live: "No migrations" на Dashboard                                                                                                                                           |
| Security             | 6/10   | Нет service_role на клиенте, RLS есть везде и корректна (подтверждено live). Но `orders` endpoint доверяет клиентским `price`/`total`, CAPTCHA на auth-эндпоинтах выключена (подтверждено live), "leaked password protection" выключена                                                                                                        |
| RLS                  | 7/10   | Live-проверка подтвердила: все 4 таблицы имеют RLS, политики точно совпадают с репозиторием, лишних mutating-policy на `products` нет. Снижение с 8 до 7 — за вводящее в заблуждение название INSERT-policy `profiles` и за то, что защита `products` держится на недокументированном платформенном event trigger, а не на осознанном процессе |
| Performance          | 6/10   | `select('*')` почти везде, раздельные запросы вместо join в `getProducts`, нет `.limit()`/пагинации в каталоге                                                                                                                                                                                                                                 |
| Maintainability      | 5/10   | Код чистый, но `docs/api/create-order.md` и `docs/architecture/backend.md` описывают несуществующую реализацию; процесс миграций документирован (`docs/migrations/`), но реально не используется — live-подтверждено ("No migrations")                                                                                                         |
| Production readiness | 4/10   | Нет персистентности заказов, нет бэкапов (Dashboard: "No backups", Free tier), нет CAPTCHA на auth, нет rate limiting на `/api/orders`                                                                                                                                                                                                         |

---

## Current Architecture

| Component                                                                  | Purpose                                                                                            | Used by                                                                                 |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `profiles`                                                                 | Расширение `auth.users`: email, full_name, выбранная платформа                                     | `getUserProfile`, `updateUserPlatform`, `account/page.tsx`, trigger `handle_new_user`   |
| `weapon_platforms`                                                         | Справочник подплатформ оружия (АК/AR/HK/…)                                                         | `getWeaponPlatforms`, `getCatalog` (совместимость), `WeaponSelector`                    |
| `product_compatibility`                                                    | M2M `products ↔ weapon_platforms` со статусом совместимости                                        | `getCatalog.getProducts`                                                                |
| `products`                                                                 | Каталог товаров (title, price, slug, category, images…)                                            | `getCatalog`, `getProduct` — **нет migration-файла**, RLS и структура live-подтверждены |
| Supabase Auth (`auth.users`)                                               | Регистрация/логин/сессии                                                                           | `(auth)/actions.ts`, `proxy.ts`, `UserMenu`, `useIsGuest`, `account/page.tsx`           |
| Trigger `handle_new_user` (`SECURITY DEFINER`, `search_path=public`)       | Авто-создание `profiles` при регистрации                                                           | `auth.users AFTER INSERT` — live-подтверждено через `pg_proc`/`pg_trigger`              |
| Функция `rls_auto_enable()` (`SECURITY DEFINER`, `search_path=pg_catalog`) | Platform event trigger: автоматически `ENABLE ROW LEVEL SECURITY` на каждой новой таблице `public` | Не задокументирована нигде в репозитории; обнаружена только live-проверкой              |

**Data flows:**

1. **Login:** `LoginForm → login() server action → supabase.auth.signInWithPassword → session cookie (SSR) → redirect /account`
2. **Register:** `RegisterForm → register() server action → supabase.auth.signUp → confirmation email (Confirm email = ON, live-подтверждено) → /auth/callback → exchangeCodeForSession → session`
3. **Session refresh / route protection:** `любой запрос → src/proxy.ts (Next 16 middleware) → supabase.auth.getUser() (валидирует JWT против Supabase, не просто читает куку) → redirect на /login или /account при необходимости`
4. **Каталог:** `CatalogPage (server component) → getProducts() → supabase.from('products').select('*') + фильтры → отдельный supabase.from('product_compatibility') запрос по userPlatformId → merge в JS → рендер`
5. **Товар:** `ProductPage → getProduct(slug) → supabase.from('products').select('*').eq('slug', slug).single()`
6. **Арсенал пользователя:** `WeaponSelector → updateUserPlatform() server action → supabase.auth.getUser() → supabase.from('profiles').update(...).eq('id', user.id) → revalidatePath`
7. **Заказ (НЕ через Supabase):** `CheckoutForm → buildOrderPayload (клиент, включая price/total из localStorage-корзины) → POST /api/orders → zod-валидация формата (не бизнес-значений) → forward в Telegram Bot API → ответ клиенту`. Нет обращения к Supabase вообще — ни для проверки цен, ни для сохранения заказа.

---

## Findings

### [HIGH] Заказы не персистентны и не идемпотентны, хотя контракт это обещает

**Где:** `src/app/api/orders/route.ts`, `docs/api/create-order.md`.
**Что происходит сейчас:** эндпоинт валидирует payload через zod и просто пересылает текст в Telegram. Нет таблицы `orders` в БД (live-подтверждено — в `information_schema.columns` для `public` только 4 таблицы: `products`, `profiles`, `weapon_platforms`, `product_compatibility`), нет проверки `clientRequestId` на дубликаты, нет кода `201`/`409`/`422` — всегда `200`/`400`/`500`/`502`.
**Почему это проблема:** документация (`docs/api/create-order.md`) описывает персистентный идемпотентный контракт — если разработчик или интегратор положится на документацию, он получит не то поведение. При сбое Telegram API (`502`) заказ просто теряется — ни в БД, ни в другой очереди его нет.
**Реальный риск:** потеря заказов при недоступности Telegram; невозможность построить отчётность/историю продаж; нет server-side источника правды о заказах.
**Как исправить:** создать таблицу `orders` (+ `order_items`) с `clientRequestId` как unique constraint, писать в БД первым шагом внутри транзакции, потом уже нотифицировать Telegram (best-effort, с ретраями/очередью). Реализовать `409` по несовпадению payload для существующего `clientRequestId`.
**Приоритет:** P1.

### [HIGH] Цена и сумма заказа полностью доверяются клиенту

**Где:** `src/modules/checkout/model/buildOrderPayload.ts`, `src/app/api/orders/payloadSchema.ts` (`price: z.number()`, `total: z.number()` — только тип проверяется, не значение).
**Что происходит сейчас:** `price` и `total` берутся из `cart.total` (localStorage-состояние Redux-корзины), клиент может отправить любые числа — сервер не сверяет их с `products.price` в Supabase.
**Почему это проблема:** это классический tampering-паттерн для заказов — цена формируется на клиенте и нигде не перепроверяется относительно источника правды (таблицы `products`).
**Реальный риск:** сейчас последствие ограничено (это текст в Telegram, который читает человек и вручную обрабатывает заказ) — поэтому не CRITICAL, но при автоматизации обработки заказов это станет прямой финансовой уязвимостью.
**Как исправить:** на сервере, перед отправкой в Telegram, подтягивать актуальные `price` из `products` по `id` и пересчитывать `total`; расхождение — не блокирующая, но логируемая аномалия.
**Приоритет:** P1.

### [HIGH] Процесс миграций сломан: schema drift подтверждён live, не только по репозиторию

**Где:** Supabase Dashboard → Project Overview (`Last migration: No migrations`, `Last backup: No backups`); SQL Editor → история сохранённых запросов (`Products table with public read access`, `Auto-create profiles on user insert`, `AK handguard product inserts` и др. — 12 приватных сниппетов, ни один не оформлен как файл в `docs/migrations/`); `docs/migrations/004_product_compatibility.sql:16` и `007_seed_compatibility.sql` ссылаются на `public.products`, которую ни один файл в репозитории не создаёт.
**Что происходит сейчас:** реальная схема БД собрана вручную через SQL Editor Dashboard, а не через `supabase db push`/migration workflow. `docs/migrations/` в репозитории — это неполный и не примененный через tooling журнал того, что было сделано вручную.
**Почему это проблема:** невозможно поднять окружение с нуля только через `docs/migrations/` (миграции `004`/`007` упадут на чистой БД — нет `products`). Live-факт "No migrations" означает, что Supabase не отслеживает историю схемы вообще — при следующей ручной правке через Dashboard узнать, что именно изменилось, можно будет только сравнивая снапшоты вручную.
**Реальный риск:** при потере доступа к текущему проекту или необходимости поднять staging-копию — восстановить схему по репозиторию не получится. RLS/constraints/индексы `products` нигде не review-able кроме как через прямой доступ к Dashboard.
**Как исправить:** сделать `supabase db pull` (или `pg_dump --schema-only`) и завести это как настоящий baseline в `supabase/migrations/` через `supabase migration` tooling, дальше — только миграции через CLI, без прямых правок в SQL Editor Dashboard для DDL.
**Приоритет:** P0.

### [MEDIUM] CAPTCHA и защита от leaked passwords выключены на auth-эндпоинтах

**Где:** Supabase Dashboard → Authentication → Attack Protection (live-проверено).
**Что происходит сейчас:** "Enable Captcha protection" — **DISABLED**; "Prevent use of leaked passwords" — **DISABLED** (требует настройки email-провайдера, которая не выполнена). Из положительного: платформенный rate limit на sign-in/sign-up (360 запросов/5 мин на IP) и token verification (360/5 мин на IP) — включён по умолчанию и работает без дополнительной настройки.
**Почему это проблема:** формы `/login` и `/register` защищены только дефолтным IP-based rate limit Supabase, без CAPTCHA — что для магазина с интересующей злоумышленников аудиторией (оружейные детали) оставляет пространство для автоматизированного перебора/спам-регистраций в рамках лимита.
**Реальный риск:** умеренный при текущем трафике проекта; вырастет при публичном запуске.
**Как исправить:** включить hCaptcha/Turnstile в Attack Protection (Supabase поддерживает "из коробки"), передать капчу токеном через `options.captchaToken` в `signInWithPassword`/`signUp` на клиенте.
**Приоритет:** P2.

### [MEDIUM] Скрытый platform-level `SECURITY DEFINER` event trigger `rls_auto_enable()` не задокументирован

**Где:** `pg_proc`/`pg_trigger` (live-проверено); отсутствует в `docs/migrations/` и во всей документации проекта.
**Что происходит сейчас:** функция `public.rls_auto_enable()` (event trigger на `CREATE TABLE` в схеме `public`, `SECURITY DEFINER`, `search_path = pg_catalog`) автоматически включает RLS на каждой новой таблице публичной схемы. Именно она объясняет, почему у `products` — созданной вручную, в обход миграций — всё равно оказался включён RLS.
**Почему это проблема:** команда, судя по документации, не знает о существовании этого механизма и, соответственно, не может на него полагаться осознанно. Это работает только для схемы `public`; для любой другой схемы или для действий, не проходящих через `CREATE TABLE` (например, `ALTER TABLE ... DISABLE ROW LEVEL SECURITY`, выполненный вручную), защиты нет.
**Реальный риск:** низкий сейчас (текущая защита работает), но это "случайная" защита, а не спроектированная — при следующей ручной DDL-операции через Dashboard RLS может быть выключен без всякого сигнала об этом.
**Как исправить:** задокументировать существование `rls_auto_enable()` в `docs/architecture/backend.md` или отдельном ADR; не полагаться на него как на единственную линию защиты — добавить проверку RLS-статуса всех таблиц в CI/чеклист перед релизом.
**Приоритет:** P2.

### [MEDIUM] INSERT-политика `profiles` разрешает юзеру вставить себе профиль напрямую, в обход триггера

**Где:** `docs/migrations/001_create_profiles.sql:26-29` (live-подтверждено — `pg_policies`: `profiles`, `Service role can insert profiles`, `INSERT`, `with_check = (auth.uid() = id)`):

```sql
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

**Что происходит сейчас:** несмотря на название policy («Service role can insert»), `WITH CHECK (auth.uid() = id)` разрешает **любому authenticated-юзеру** сделать `insert into profiles (id, email, full_name) values (auth.uid(), '...', '...')` напрямую через клиент, а не только через `SECURITY DEFINER`-триггер, как написано в комментарии над политикой.
**Почему это проблема:** название и комментарий вводят в заблуждение относительно реального разрешения. Не эскалация привилегий (юзер и так `auth.uid() = id`), но потенциальная гонка: если триггер `handle_new_user` и клиентский insert сработают почти одновременно для одного `id`, поведение не определено явно (нет `ON CONFLICT` ни в триггере, ни в защите от повторной вставки).
**Реальный риск:** низкий при текущем использовании (в коде нет прямого `insert` в `profiles` — везде только `select`/`update`), но ловушка для будущих изменений.
**Как исправить:** либо убрать policy (полагаясь только на `SECURITY DEFINER`-триггер), либо явно задокументировать разрешение и добавить `ON CONFLICT (id) DO NOTHING` в триггер.
**Приоритет:** P2.

### [MEDIUM] `getProducts` делает два раздельных запроса вместо одного join

**Где:** `src/modules/catalog/api/getCatalog.ts:16-75`.
**Что происходит сейчас:** сначала `select('*')` из `products`, затем второй запрос `product_compatibility` по массиву `productIds` (`.in('product_id', productIds)`), затем merge в JS через `Map`.
**Почему это проблема:** N+1-подобный паттерн на уровне каталога — 2 round-trip к Postgres вместо одного. PostgREST поддерживает embedded resource select одним запросом.
**Реальный риск:** сейчас (десятки товаров) — не критично; при росте каталога добавляет линейную задержку.
**Как исправить:** переписать на один embedded select через FK-relationship (`product_compatibility!inner(status)` с фильтром по `platform_id`), либо RPC-функция.
**Приоритет:** P2.

### [LOW] `select('*')` без ограничения колонок и без пагинации во всех Supabase-запросах

**Где:** `getCatalog.ts:16`, `getProduct.ts:9`, `getWeaponPlatforms.ts:9`, `getUserProfile.ts:15`.
**Что происходит сейчас:** каждый запрос тянет все столбцы, каталог не имеет `.limit()`/`.range()` — при росте `products` `getProducts()` выкачивает всю таблицу на каждый рендер.
**Почему это проблема:** overfetching + отсутствие pagination перестаёт работать при росте каталога, а не гипотетический риск.
**Реальный риск:** для `profiles`/`weapon_platforms` — незначимо. Для `products` — станет узким местом первым при масштабировании каталога.
**Как исправить:** явные списки колонок под каждый use case, `.range()`-пагинация в каталоге.
**Приоритет:** P2 (сейчас) / P1 (при заметном росте каталога).

### [LOW] Отсутствуют DB-level CHECK constraints на критичных инвариантах

**Где:** `products.price` (live-подтверждено через `pg_constraint`: у `products` только `PRIMARY KEY (id)` и `UNIQUE (slug)`, никаких `CHECK`).
**Что происходит сейчас:** ничто на уровне БД не запрещает отрицательную или нулевую цену, пустой `title`/`slug` через прямой insert (сейчас это не эксплуатируется, т.к. INSERT в `products` не открыт клиенту, но это единственный слой защиты, если он когда-то появится).
**Реальный риск:** низкий сейчас, поскольку `products` мутируется только вручную через Dashboard.
**Как исправить:** `ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0)`; при появлении админ-панели — обязательно.
**Приоритет:** P3.

### [LOW] Auth error-message policy: часть сообщений раскрывает существование email

**Где:** `src/app/(auth)/actions.ts:20` — `'user already registered': 'Пользователь с таким email уже зарегистрирован'`.
**Что происходит сейчас:** комментарий над функцией говорит «no specific "user not found" messages» (для логина верно), но для регистрации отдельно раскрывается, что email уже занят.
**Почему это проблема:** email/user enumeration через форму регистрации.
**Реальный риск:** для магазина оружейных комплектующих раскрытие факта регистрации email — умеренный риск приватности. Осознанный UX-компромисс, не баг.
**Как исправить:** нейтральное сообщение на форме + email-уведомление «уже есть аккаунт» вместо явного разоблачения в UI.
**Приоритет:** P3.

### [INFO] Индекс есть только там, где явно нужен join — это правильно

**Где:** `idx_compatibility_platform ON product_compatibility(platform_id)` — live-подтверждено, единственный «ручной» индекс сверх PK/UNIQUE, и он под реальный запрос (`getCatalog.ts:59-63`).
Хорошее, целевое решение. Live-проверка также подтвердила отсутствие лишних/дублирующих индексов — все 7 индексов в БД происходят либо из PK/UNIQUE constraints, либо из этого одного целевого индекса.

### [INFO] `contactMethod: 'vk'` в API-документации отсутствует, но в схеме есть

**Где:** `src/app/api/orders/payloadSchema.ts` использует `ContactMethod.VK`, но `docs/api/create-order.md` описывает `contactMethod: 'phone' | 'telegram'` без `vk`.
**Как исправить:** обновить `docs/api/create-order.md`.
**Приоритет:** P3.

---

## Improvement Roadmap

### P0 — исправить немедленно

- Восстановить реальный migration workflow: `supabase db pull` → baseline в `supabase/migrations/`, дальше только через CLI/migration tooling, без прямых DDL-правок в SQL Editor Dashboard — **M**

### P1 — исправить до production

- Персистентность заказов: таблица `orders`/`order_items`, реальная идемпотентность по `clientRequestId`, коды ответа по контракту — **L**
- Server-side пересчёт `price`/`total` заказа по данным из `products` перед отправкой в Telegram — **S**
- Обновить `docs/api/create-order.md` и `docs/architecture/backend.md` под реальное или под запланированное поведение — **XS**

### P2 — желательно исправить

- Включить CAPTCHA (hCaptcha/Turnstile) на `/login` и `/register` через Attack Protection — **S**
- Задокументировать `rls_auto_enable()` и не полагаться на него как на единственную защиту (добавить RLS-чеклист в релизный процесс) — **XS**
- Объединить `getProducts`/`product_compatibility` запросы в один (embedded select или RPC) — **S**
- Явные списки колонок + `.range()`-пагинация для `products` — **M**
- Убрать вводящее в заблуждение название/комментарий у INSERT-policy `profiles`, добавить `ON CONFLICT` в триггер — **XS**

### P3 — future improvements

- CHECK-constraint на `products.price > 0` — **XS**
- Rate limiting на `/api/orders` (сейчас ничего не защищает от спама заказов, в отличие от Auth-эндпоинтов, где есть дефолтный лимит Supabase) — **S**
- Решить trade-off по email enumeration в форме регистрации — **XS**
- Настроить email-провайдера, чтобы разблокировать "Prevent use of leaked passwords" — **S**
- Мониторинг/алерты на 502 от Telegram API — **S**

---

## What is already done well

- **`getUser()` вместо `getSession()` в middleware** (`src/proxy.ts:79-84`) — частая ошибка Supabase+Next.js проектов explicit avoided с грамотным комментарием в коде.
- **Чёткое разделение browser/server клиентов**, нет `service_role` ни в одном клиентском файле, нет утечки privileged credentials в бандл — подтверждено и статически, и по факту отсутствия таких ключей в `.env.local`.
- **RLS-политики корректны и live-подтверждены**: `auth.uid() = id` для `profiles`, `USING (true)` для публичных read-only справочников — политики в БД дословно совпадают с репозиторием, никакого дрифта.
- **`SECURITY DEFINER` с явным `SET search_path`** — и в триггере `handle_new_user` (`search_path=public`), и в платформенной `rls_auto_enable()` (`search_path=pg_catalog`) — оба защищены от search_path injection, это нередко пропускают.
- **Дефолтный rate limiting Supabase на auth-эндпоинтах уже работает** (360 sign-in/sign-up запросов и 360 token-verification за 5 минут на IP) — не настраивалось специально, но это реальная защита, о которой стоит знать при планировании CAPTCHA.
- **Server actions с zod-валидацией на входе** (`updateUserPlatform`, `login`, `register`).
- **Open redirect защита в auth callback** (`src/app/auth/callback/route.ts:16`).
- **CSP и security headers на каждый ответ** (`src/proxy.ts:22-36`), включая точечный `connect-src` под `*.supabase.co`.
- **"Confirm email" включён** на уровне Supabase Auth (live-подтверждено) — пользователи не могут войти без подтверждения почты.

---

## Финальный verdict

1. **Что уже сделано правильно:** аутентификация и session-handling через `@supabase/ssr`, RLS на пользовательских таблицах с корректным `auth.uid()` (live-подтверждено дословное совпадение с репозиторием), отсутствие privileged credentials на клиенте, security headers, серверная zod-валидация, "Confirm email" включён.
2. **Что сделано неправильно:** заказы не проходят через Supabase вообще; цена заказа не перепроверяется на сервере; реальный migration workflow не используется — Dashboard прямо показывает "No migrations", схема собрана вручную через SQL Editor; CAPTCHA и leaked-password protection выключены; каталожные запросы неоптимальны.
3. **Какие 5 вещей исправить первыми:** (1) восстановить настоящий migration workflow (`supabase db pull` → baseline → CLI-only DDL), (2) сделать заказы персистентными в Supabase, (3) пересчитывать `price`/`total` на сервере из `products`, (4) включить CAPTCHA на auth-формах, (5) синхронизировать `docs/api/create-order.md` с реальностью.
4. **Какие 5 вещей стоит добавить:** rate limiting на `/api/orders` (сейчас незащищён, в отличие от auth-эндпоинтов), `.range()`-пагинацию каталога, `ON CONFLICT` в триггере `handle_new_user`, CHECK-constraint на `products.price`, документацию про `rls_auto_enable()` как явную часть security-модели, а не случайную защиту.
5. **Есть ли security vulnerabilities:** прямых уязвимостей privilege escalation через RLS не найдено — live-проверка подтвердила корректность всех политик на всех 4 таблицах. Главный риск — доверие клиентским `price`/`total` в заказах (HIGH, но низкой эксплуатируемости сейчас) и отсутствие CAPTCHA на auth (MEDIUM, частично компенсировано дефолтным rate limit Supabase).
6. **Есть ли проблемы с RLS:** нет проблем с самими политиками (live-подтверждено); есть проблема с тем, что защита `products` держится на недокументированном платформенном механизме (`rls_auto_enable()`), а не на осознанном процессе, и с вводящим в заблуждение названием INSERT-policy `profiles`.
7. **Есть ли проблемы с database architecture:** да, главная — реальный migration workflow не используется (live-подтверждено: "No migrations", "No backups"), схема собрана вручную; заказы вообще не в БД.
8. **Есть ли проблемы с производительностью:** да, но не критичные при текущем масштабе — overfetching и раздельные запросы в каталоге станут первым узким местом при росте числа товаров.
9. **Что сейчас будет первым bottleneck при росте:** каталог — `select('*')` без пагинации и раздельные запросы `products`/`product_compatibility` на каждый рендер; второе по значимости — отсутствие персистентного слоя заказов.
10. **Вердикт:** **NOT READY — FIX P0/P1 FIRST.** Причина: часть, что реализована (auth, RLS для всех 4 таблиц), сделана достаточно грамотно и live-проверка это подтвердила. Но ключевой бизнес-процесс (заказы) не персистентен, не идемпотентен и не перепроверяет цену на сервере, а сам процесс изменения схемы БД по факту не отслеживается (нет migration history, нет backups на Free tier) — это конкретные, live-подтверждённые проблемы, а не гипотезы, и их нужно закрыть до реального запуска продаж.
