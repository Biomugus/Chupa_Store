# Уведомления о заказах и обращениях

## Зона ответственности

Оповещение основателей о новом заказе (`POST /api/orders`) или обращении (`POST /api/feedback`). Код — `src/shared/lib/notifications/`.

Заказ или обращение **сначала сохраняется в Supabase** (`orders` / `feedback_requests`), и только потом уходят уведомления. База — источник правды, каналы — подстраховка: если какой-то канал недоступен, заявка не теряется (ADR 0003).

## Каналы

| Канал    | Файл          | Куда приходит                                     | Env                                                                   |
| -------- | ------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| Telegram | `telegram.ts` | Бот мастерской → чат `TG_CHAT_ID`                 | `TG_BOT_TOKEN`, `TG_CHAT_ID`                                          |
| VK       | `vk.ts`       | Сообщество → ЛС основателям или беседа сообщества | `VK_GROUP_TOKEN`, `VK_NOTIFY_PEER_IDS`                                |
| Почта    | `email.ts`    | Письмо с рабочего ящика на `NOTIFY_EMAIL_TO`      | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL_TO` |

Текст один для всех каналов — plain text из `buildOrderData` (`modules/checkout/utils/orderTextBuilder.ts`) и `buildFeedbackData` (`modules/contacts/utils/feedbackTextBuilder.ts`). Ссылка «Написать» на контакт клиента в Telegram — inline-кнопка, в письме — строка в конце.

## Как работает

```
POST → валидация → INSERT в Supabase → ответ 201
                                     → after(): notifyOwner()
                                          ├─ Telegram ┐
                                          ├─ VK       ├─ параллельно, Promise.allSettled
                                          └─ Почта    ┘
                                     → UPDATE notifications = { telegram, vk, email }
```

- `notifyOwner()` (`index.ts`) не бросает исключений. Каждый канал возвращает `ChannelResult`, а итог сводится в `NotificationSummary`:
  - `ok` — доставлено;
  - `skipped` — канал не настроен (нет env), это не ошибка;
  - `failed` — сервис не ответил или вернул ошибку; в лог пишется `Failed to send notification via <канал>`.
- VK считается `failed`, если сообщение не дошло хотя бы одному получателю из `VK_NOTIFY_PEER_IDS`.
- Если не настроен ни один канал, в лог пишется `No notification channels configured`. Заявка при этом всё равно сохраняется.
- Уведомления отправляются в `after()` из `next/server`, поэтому покупатель не ждёт Telegram, VK и SMTP. Таймаут каждого запроса — 10 с (`NOTIFICATION_TIMEOUT_MS`).
- Повтор заказа с тем же `clientRequestId` уведомления повторно не рассылает.

Итог по каналам лежит в колонке `notifications`. Заявки, о которых не пришло ни одно уведомление, ищутся в Supabase SQL Editor:

```sql
select * from orders
where notifications->>'telegram' is distinct from 'ok'
  and notifications->>'vk' is distinct from 'ok'
  and notifications->>'email' is distinct from 'ok'
order by created_at desc;
```

## Где смотреть заявки

Supabase Dashboard → Table Editor → `orders` / `feedback_requests`. Там же меняется `status` (`new` → `in_progress` → `done` / `cancelled`). Таблицы закрыты RLS без политик: с сайта их не прочитать, пишет только сервер через `service_role` (`shared/api/supabase/admin.ts`).

## Настройка

Канал включается, когда заданы все его env-переменные. Каналы независимы: можно включить любые. Переменные задаются в `.env.local` для локальной разработки и в Vercel → Project Settings → Environment Variables для Production и Preview. Для Preview — тестовые бот, ящик и получатели, чтобы проверки не засоряли рабочие каналы. Шаблон — `.env.example`.

### Supabase

1. Накатить `docs/migrations/008_orders_and_feedback.sql` через SQL Editor.
2. Project Settings → API → `service_role` key → в `SUPABASE_SERVICE_ROLE_KEY`. Ключ обходит RLS: только серверные env, без префикса `NEXT_PUBLIC_`.

### Telegram

1. В @BotFather — `/newbot`, токен → `TG_BOT_TOKEN`.
2. Написать боту любое сообщение (или добавить его в групповой чат основателей).
3. Открыть `https://api.telegram.org/bot<токен>/getUpdates`, взять `message.chat.id` → `TG_CHAT_ID`. У групп id отрицательный.

Из РФ `api.telegram.org` без VPN недоступен, поэтому при `npm run dev` без VPN канал будет `failed`. Это ожидаемо и на остальные каналы не влияет. Функции Vercel работают за рубежом, и в проде Telegram доступен.

### VK

Сообщения идут от имени сообщества мастерской.

1. Сообщество → Управление → Сообщения → включить «Сообщения сообщества».
2. Управление → Работа с API → Ключи доступа → «Создать ключ» с правом «Сообщения сообщества» → `VK_GROUP_TOKEN`.
3. Выбрать, куда слать, и записать в `VK_NOTIFY_PEER_IDS` (через запятую):
   - **ЛС основателям** — числовые id страниц, например `123456,654321`. Id виден в адресе `vk.com/id123456`. Если задан короткий адрес, id можно узнать через метод `utils.resolveScreenName`. **Каждый получатель должен первым написать сообществу**, иначе VK вернёт ошибку `901` («нет разрешения на сообщения»).
   - **Беседа** — в Сообщения → Настройки для бота разрешить добавлять сообщество в беседы, добавить сообщество в беседу основателей. `peer_id` беседы = `2000000000 + N`, где N — номер беседы у сообщества (первая — `2000000001`).

### Почта

Нужен отдельный рабочий ящик-отправитель, например на Яндекс 360 или Mail.ru.

1. Включить в ящике доступ почтовых программ и создать **пароль приложения**: Яндекс ID → Безопасность → Пароли приложений → «Почта»; у Mail.ru — Настройки → Безопасность → Пароли для внешних приложений. Основной пароль от ящика SMTP не примет.
2. Заполнить:
   - `SMTP_HOST` — `smtp.yandex.ru` или `smtp.mail.ru`;
   - `SMTP_PORT` — `465` (по умолчанию, TLS) или `587` (STARTTLS);
   - `SMTP_USER` — адрес ящика, он же отправитель (`From`);
   - `SMTP_PASS` — пароль приложения;
   - `NOTIFY_EMAIL_TO` — получатели через запятую (может совпадать с `SMTP_USER`).
3. Если первые письма попадут в «Спам», отметить их как «Не спам» или завести правило на отправителя.

## Проверка

1. `npm run dev`, оформить тестовый заказ и обращение.
2. В Table Editor появились строки, через несколько секунд заполнилась колонка `notifications`.
3. Пришли сообщения во все настроенные каналы. При `failed` причина есть в логе сервера (локально — терминал, на Vercel — Deployment → Logs).
