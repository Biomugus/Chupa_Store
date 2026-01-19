# Create Order API

## Endpoint
POST /api/orders

## Purpose
Создание заказа на основе данных корзины клиента.
Ручка является идемпотентной относительно `clientRequestId`.

---

## Idempotency

Поле `clientRequestId` используется для предотвращения дублирующих заказов.

Поведение сервера:

- Если запрос с данным `clientRequestId` обрабатывается впервые — создаётся новый заказ
- Если заказ с таким `clientRequestId` уже существует — сервер возвращает ранее созданный заказ
- Если `clientRequestId` существует, но тело запроса отличается — возвращается ошибка `409 Conflict`

---

## Request

### Content-Type
`application/json`

### Schema

```ts
type OrderPayload = {
  clientRequestId: string;

  customer: {
    fullName: string;
    phone: string;
    contactMethod: 'phone' | 'telegram';
    contactValue: string;
    location?: string;
  };

  delivery: {
    service: 'pickup' | 'courier';
  };

  payment: {
    method: 'cash' | 'card';
  };

  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;

  total: number;
};
```

## Success Response
### 201 Created

```ts
type CreateOrderResponse = {
  orderId: string;
};
```

```json
{
  "orderId": "ORD-2024-000123"
}
```

## Error Responses
### 422 Validation Error

- Возвращается, если входные данные не прошли серверную валидацию.

```json
{
  "message": "Validation failed",
  "details": {
    "phone": "Invalid format",
    "contactValue": "Invalid telegram username"
  }
}
```

## 409 Conflict

- Возвращается, если заказ с таким clientRequestId уже существует, но тело запроса отличается от ранее сохранённого.

```json
{
  "message": "Order already exists with different payload"
}
```

## 500 Internal Server Error

- Возвращается при непредвиденной ошибке сервера.

```json
{
  "message": "Internal server error"
}
```