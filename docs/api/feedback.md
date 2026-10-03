# API обращений

## Эндпоинт

POST /api/feedback

## Назначение

Обращение с формы на `/contacts`. Сервер **сохраняет обращение в Supabase** (таблица `feedback_requests`, миграция `docs/migrations/008_orders_and_feedback.sql`) и после ответа рассылает уведомления в Telegram, VK и на почту — см. [modules/notifications.md](../modules/notifications.md). Текст начинается с шапки `📩 ОБРАЩЕНИЕ С САЙТА · <тема>`, тема письма — `Обращение · <тема> · <имя>`, чтобы отличать обращения от заказов.

Реализация: `src/app/api/feedback/route.ts`, хранение — `src/modules/contacts/api/feedbackStorage.ts`.

## Запрос

`application/json`, схема — `src/modules/contacts/model/contactFormSchema.ts`:

```json
{
  "name": "Иван",
  "contact": "@ivan_petrov",
  "topic": "custom",
  "message": "Хочу приклад из ореха на АК-74",
  "website": ""
}
```

- `contact` — телефон, `@username`, email или ссылка на t.me / vk.com / vk.ru. Для Telegram/VK в уведомлении появляется ссылка «Написать» (в Telegram — кнопка под сообщением).
- `website` — скрытое поле-ловушка для ботов (honeypot), у людей всегда пустое.

## Ответы

Ошибки — в формате ADR 0002: `{ message, details? }`.

| Статус                   | Когда                                                                        |
| ------------------------ | ---------------------------------------------------------------------------- |
| 201 `{ "status": "ok" }` | Сохранено (или сработал honeypot — ответ такой же, но ничего не сохраняется) |
| 400                      | Тело не JSON                                                                 |
| 422                      | Невалидные поля, `details` — ошибки по полям                                 |
| 429                      | Больше 3 обращений в минуту с одного IP                                      |
| 500                      | Supabase не принял запись; обращение целиком пишется в `console.error`       |

Сбой уведомлений ошибкой не считается: ответ 201, итог по каналам — в `feedback_requests.notifications`.
