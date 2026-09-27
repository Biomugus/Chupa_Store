# Модуль cart

## Зона ответственности

Хранение и управление состоянием корзины, страница `/cart` и запуск чекаута.

## Публичный API

`src/modules/cart/index.ts`: `useCart`, тип `CartItem`.

## Модель данных

- `CartItem` — `id`, `title`, `price`, `quantity`, `image`, `characteristics?`
- Состояние slice — `{ items: CartItem[] }`, сумма считается селектором `selectCartTotal`
- `CartSnapshot` (`{ items, total }`) определён в `checkout` и передаётся в форму заказа

## Состояние

slice Redux Toolkit `store/cartSlice.ts`:

- `addItem` — если товар с таким `id` уже есть, увеличивает `quantity`, иначе добавляет
- `changeQuantity` (`delta: 1 | -1`) — при `quantity` 0 удаляет позицию
- `removeItem`, `clearCart`

`useCart` отдаёт `items`, `total`, `addItem`, `changeQuantity`, `clear`.

## Бизнес-правила

- `quantity >= 1`: позиция удаляется, когда количество уходит в 0
- Кнопка «Оформить заказ» показывается только при `total > 0`
- После успешного заказа корзина очищается

## Оформление заказа

`containers/CartPageContainer` открывает модалку:

1. Гость → `RegistrationNudge` (зарегистрироваться или «Продолжить без регистрации»); залогиненный — сразу форма
2. `CheckoutFormContainer` из модуля `checkout`
3. Успех → `clearCart` и `CartSuccessView`

## Побочные эффекты

- Каждое изменение сохраняется в localStorage (`dal/cartStorage.ts`, ключ `cart_items`)
- Начальное состояние читается из localStorage при создании Redux store; на сервере — пустая корзина, поэтому UI ждёт `mounted`, чтобы не было рассинхрона гидрации

## Зависимости

- Redux Toolkit (`src/lib/store.ts`)
- localStorage
- `checkout` (форма заказа), `shared/hooks/useIsGuest`
