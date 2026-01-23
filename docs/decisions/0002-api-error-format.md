# 0002 API Error Format

## Context

UI должен обрабатывать ошибки формы.

## Decision

Используем формат:
{
message: string,
details?: Record<string, string>
}

## Consequences

- Унифицированная обработка ошибок
- Простая интеграция с формами
