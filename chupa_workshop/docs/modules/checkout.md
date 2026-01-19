# Checkout Module

## Responsibility
Оформление заказа.

## Flow
1. Cart snapshot
2. Form fill
3. Submit
4. Success / Retry / Exit

## Payload
OrderPayload фиксируется при первом submit.

## Error handling
- Validation errors → form fields
- System errors → retry state
