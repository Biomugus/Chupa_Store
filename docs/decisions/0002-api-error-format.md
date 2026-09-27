# 0002 Формат ошибок API

## Статус

Принято, применено частично.

## Контекст

UI должен обрабатывать ошибки формы.

## Решение

Используем формат:

```ts
{
  message: string,
  details?: Record<string, string>
}
```

## Последствия

- Унифицированная обработка ошибок
- Простая интеграция с формами

## Текущее состояние

- Клиент: тип `ApiError` (`shared/api/apiTypes.ts`) — этот формат плюс `status` и `cause`. `shared/api/httpClient.ts` пробрасывает JSON-тело `{ message, details }` как есть, для не-JSON ответа кладёт текст в `message`.
- `POST /api/feedback` — следует формату.
- `POST /api/orders` — пока отвечает обычным текстом (`Invalid payload`, `Too many requests`, …), `details` не отдаёт.
- `POST /api/suggestions/city` — отвечает `{ error: string }`.
