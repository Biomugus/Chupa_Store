# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chupa Workshop — storefront for a custom weapon-parts/armory shop.

## Commands

`npm run commit` runs `git add -A && cz` — it stages everything before the Commitizen wizard.

Commits are enforced by commitlint + husky (`commit-msg` hook) and must follow Conventional Commits (`type(scope): subject`, see `docs/commit-convention.md`). `pre-commit` runs `lint-staged` (prettier) on staged files.

**Language of commits and PRs:** titles stay in English, content is in Russian.

- Commit header (`type(scope): subject`) and PR title: English, e.g. `feat(header): show name initial in user avatar`.
- Commit body and PR description: Russian.
- Code identifiers, file paths and commands stay as-is.

## Architecture

### Module structure (`src/modules/*`)

Business logic lives in feature modules under `src/modules/*`, each internally layered per `docs/architecture/*`.

Declared boundary rule (`docs/architecture/overview.md`): UI must not know about the API directly; domain logic must not import React; services hold no business logic. Data flow is `UI → Container → Domain → Service → API`.

A module exposes its public surface via `index.ts` (see `src/modules/cart/index.ts`) — prefer importing through that barrel from outside the module rather than reaching into internal files.

### State & data

- **Cart**: Redux Toolkit (`src/lib/store.ts` registers only the `cart` reducer), persisted to `localStorage` via `modules/cart/dal/cartStorage.ts` per ADR `docs/decisions/0001-use-localstorage-for-cart.md`. There is no server-side cart.
- **Catalog/products**: fetched server-side from Supabase (`modules/catalog/api/getCatalog.ts`), including a per-user compatibility join against `product_compatibility` keyed by the user's selected weapon platform (see armory module and `docs/migrations/003_weapon_platforms.sql`–`007_seed_compatibility.sql`).
- **Auth**: Supabase, split into a browser client (`shared/api/supabase/client.ts`, `createBrowserClient`) and a server client (`shared/api/supabase/server.ts`, `createServerClient` bound to Next.js `cookies()`). Never mix these — server components/actions use the server client, client components use the browser client.
- **Order submission**: `checkout` module builds an `OrderPayload` client-side (`model/buildOrderPayload.ts`, includes a `crypto.randomUUID()` `clientRequestId`) and posts it to `POST /api/orders`. `docs/api/create-order.md` documents this endpoint as idempotent-by-`clientRequestId` with persisted orders and 409/422 responses, but the current implementation in `src/app/api/orders/route.ts` only validates the payload with zod and forwards it as a Telegram message (`TG_BOT_TOKEN`/`TG_CHAT_ID` env vars) — there is no persistence or idempotency check yet. Treat the docs as the target contract, not the current behavior, when working on this endpoint.
- **Errors**: normalized to `{ message: string, details?: Record<string,string> }` (`ApiError` in `shared/api/apiTypes.ts`, ADR `docs/decisions/0002-api-error-format.md`); `shared/api/httpClient.ts` throws this shape on non-OK responses so hooks can surface `details` as per-field form errors.

### CSS budget

- `npm run build` enforces a CSS size budget via `scripts/check-css-size.mjs`; a regression here fails the build script (not `next build` itself).

### Docs

`docs/README.md` indexes: architecture (`docs/architecture/`), API contracts (`docs/api/`), per-module specs (`docs/modules/`), and ADRs (`docs/decisions/`). Check the relevant doc before changing cross-cutting behavior in `cart`, `checkout`, or the orders API — and update it if the change makes the doc stale (see the orders-endpoint drift noted above).

Supabase schema evolves via numbered SQL files in `docs/migrations/` (001–007 so far: profiles, weapon platforms, product compatibility, seed data) — treat these as the source of truth for DB shape (`src/types/supabase.ts` is the generated types file).
