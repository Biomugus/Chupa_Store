# API создания заказа

## Эндпоинт

POST /api/orders

## Назначение

Оформление заказа из корзины. Сервер валидирует payload, **сохраняет заказ в Supabase** (таблица `orders`, миграция `docs/migrations/008_orders_and_feedback.sql`) и после ответа покупателю рассылает уведомления в Telegram, VK и на почту — см. [modules/notifications.md](../modules/notifications.md). База — источник правды, уведомления работают по принципу best-effort: сбой канала заказ не теряет и на ответ не влияет (ADR 0003).

Реализация: `src/app/api/orders/route.ts`, схема — `src/app/api/orders/payloadSchema.ts`, хранение — `src/modules/checkout/api/orderStorage.ts`.

---

## Запрос

### Content-Type

`application/json`

### Схема

Тип — `OrderPayload` в `src/modules/checkout/types/checkoutTypes.ts`, собирается на клиенте в `buildOrderPayload`.

```ts
type OrderPayload = {
  clientRequestId: string; // UUID, crypto.randomUUID() на клиенте

  customer: {
    fullName: string; // минимум 5 символов, только буквы, пробел и дефис
    phone: string; // формат `+7 (999) 999-99-99`
    contactMethod: 'telegram' | 'vk';
    contactValue: string; // telegram: `@?[a-zA-Z0-9_]{5,32}`, vk: ссылка `vk.com/...` или `vk.ru/...`
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

### 201 Created

```json
{
  "status": "ok",
  "orderId": "3f1c2b7e-..."
}
```

`orderId` — это присланный `clientRequestId`.

Если заполнено поле-ловушка `website`, ответ такой же, но заказ не сохраняется и уведомления не уходят.

## Что происходит после ответа

1. Заказ уже записан в `orders` со статусом `new`.
2. В `after()` (Next.js) вызывается `notifyOwner()`: Telegram, VK и почта параллельно.
3. Итог по каналам пишется в `orders.notifications`, например `{ "telegram": "ok", "vk": "ok", "email": "failed" }`. Значения: `ok`, `failed`, `skipped` (канал не настроен).

## Ошибки

Ошибки отдаются **обычным текстом** (plain text), не в формате ADR 0002. Текст технический — покупателю его не показывают, `useSubmitOrder` подбирает сообщение по статусу.

| Статус | Тело                   | Когда                                                                                                                                   |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | `Invalid payload`      | Тело не JSON или не прошло zod-схему, в том числе `clientRequestId` не UUID (ошибки по полям не возвращаются)                           |
| 429    | `Too many requests`    | Больше 5 заказов в минуту с одного IP                                                                                                   |
| 500    | `Failed to save order` | Supabase не принял запись (нет `SUPABASE_SERVICE_ROLE_KEY`, не накатана миграция 008, сбой БД); заказ целиком пишется в `console.error` |

Сбой уведомлений ошибкой не считается: покупатель получает 201, а упавший канал виден в `orders.notifications` и в логах (`Failed to send notification via <канал>`).

## Идемпотентность

`orders.client_request_id` — уникальный. Повтор с тем же `clientRequestId` не создаёт второй заказ: сервер отвечает тем же 201 и **не рассылает уведомления повторно** — они уже ушли с первого запроса.

На клиенте `useSubmitOrder` собирает payload один раз и переиспользует его при «Повторить попытку», поэтому `clientRequestId` при повторе не меняется. Это закрывает сценарий «заказ сохранился, но ответ не дошёл из-за обрыва сети».

Тело повтора с ранее сохранённым не сравнивается — первый заказ остаётся как есть.

---

## Планы

Пока не реализовано:

- Ошибки в формате ADR 0002:
  - `422` — `{ "message": "Validation failed", "details": { "phone": "Invalid format" } }`;
  - `500` — `{ "message": "Internal server error" }`.
- Повтор с тем же `clientRequestId`, но другим телом — `409 Conflict`, `{ "message": "Order already exists with different payload" }`.
- Перепроверка `price` и `total` по таблице `products`.
