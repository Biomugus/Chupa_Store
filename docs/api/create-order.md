# API создания заказа

## Эндпоинт

POST /api/orders

## Назначение

Оформление заказа из корзины. Сервер валидирует payload и отправляет заказ сообщением в Telegram-бот мастерской (`TG_BOT_TOKEN` / `TG_CHAT_ID`). Заказы нигде не сохраняются, дальше их обрабатывают вручную.

Реализация: `src/app/api/orders/route.ts`, схема — `src/app/api/orders/payloadSchema.ts`.

---

## Запрос

### Content-Type

`application/json`

### Схема

Тип — `OrderPayload` в `src/modules/checkout/types/checkoutTypes.ts`, собирается на клиенте в `buildOrderPayload`.

```ts
type OrderPayload = {
  clientRequestId: string; // crypto.randomUUID() на клиенте

  customer: {
    fullName: string; // минимум 5 символов, только буквы, пробел и дефис
    phone: string; // формат `+7 (999) 999-99-99`
    contactMethod: 'telegram' | 'vk';
    contactValue: string; // telegram: `@?[a-zA-Z0-9_]{5,32}`, vk: ссылка `vk.com/...`
    location: string; // город, обязателен
  };

  delivery: {
    service: 'post_russia' | 'cdek' | 'yandex' | 'dpd' | 'pony_express';
  };

  payment: {
    method: 'card_transfer' | 'legal_entity';
  };

  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number; // целое > 0
  }>;

  total: number;

  website?: string; // поле-ловушка для ботов (honeypot), у людей всегда пустое
};
```

`price` и `total` приходят с клиента и на сервере не перепроверяются.

## Успешный ответ

### 200 OK

```json
{
  "status": "ok",
  "orderId": "3f1c2b7e-..."
}
```

`orderId` — это присланный `clientRequestId`.

Если заполнено поле-ловушка `website`, ответ такой же, но заказ никуда не отправляется.

## Ошибки

Ошибки отдаются **обычным текстом** (plain text), не в формате ADR 0002. Текст технический — покупателю его не показывают, `useSubmitOrder` подбирает сообщение по статусу.

| Статус | Тело                   | Когда                                                                  |
| ------ | ---------------------- | ---------------------------------------------------------------------- |
| 400    | `Invalid payload`      | Тело не JSON или не прошло zod-схему (ошибки по полям не возвращаются) |
| 429    | `Too many requests`    | Больше 5 заказов в минуту с одного IP                                  |
| 500    | `Server misconfigured` | Не заданы `TG_BOT_TOKEN` / `TG_CHAT_ID`                                |
| 502    | Ответ Telegram API     | Telegram не принял сообщение; заказ целиком пишется в `console.error`  |
| 502    | Текст сетевой ошибки   | Telegram недоступен или не ответил за 10 с (`TELEGRAM_TIMEOUT_MS`)     |

## Идемпотентность

Сервер `clientRequestId` не проверяет — повторный запрос отправит заказ в Telegram ещё раз.

На клиенте `useSubmitOrder` собирает payload один раз и переиспользует его при «Повторить попытку», поэтому `clientRequestId` при повторе не меняется — задел под идемпотентность на сервере.

---

## Планы

Целевой контракт, пока не реализован:

- Заказ сохраняется, ответ — `201 Created` с `{ "orderId": "..." }`.
- Идемпотентность по `clientRequestId`:
  - первый запрос — создаётся заказ;
  - повтор с тем же телом — возвращается ранее созданный заказ;
  - повтор с другим телом — `409 Conflict`, `{ "message": "Order already exists with different payload" }`.
- Ошибки в формате ADR 0002:
  - `422` — `{ "message": "Validation failed", "details": { "phone": "Invalid format" } }`;
  - `500` — `{ "message": "Internal server error" }`.
