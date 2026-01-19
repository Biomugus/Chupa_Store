# Backend Architecture (Planned)

## Responsibility
- Order creation
- Validation
- Idempotency via clientRequestId

## Error strategy
- Validation errors → 4xx
- Business errors → 409
- System errors → 500

## Contract-first
Backend реализует контракт, описанный в /docs/api
