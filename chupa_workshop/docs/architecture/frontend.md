# Frontend Architecture

## Stack
- React
- TypeScript
- CSS Modules

## Module structure
Каждый бизнес-модуль инкапсулирует:
- UI
- Container
- Hooks
- Types
- Services

## State management
- Локальный state (hooks)
- Cart: localStorage snapshot

## Error handling
- API errors нормализуются в хуках
- UI получает только message + field errors