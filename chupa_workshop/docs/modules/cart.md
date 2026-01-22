# Cart Module

## Responsibility

Хранение и управление состоянием корзины.

## Data model

- CartItem
- CartSnapshot

## Business rules

- Quantity >= 1
- Cart cannot be empty on checkout

## Side effects

- Persist to localStorage

## Dependencies

- localStorage
