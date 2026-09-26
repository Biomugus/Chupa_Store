# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chupa Workshop — Next.js 16 (App Router) storefront for a custom weapon-parts/armory shop. React 19, TypeScript strict, Supabase (auth + Postgres) as backend, Redux Toolkit for cart state, Tailwind + CSS Modules for styling, shadcn/ui ("new-york" style) via `components.json`.

## Commands

```bash
npm run dev              # start dev server (localhost:3000)
npm run build             # next build, then runs scripts/check-css-size.mjs (CSS budget report)
npm run start              # start production server

npm run lint               # eslint .
npm run lint:fix
npm run format              # prettier --write over src/**
npm run format:check

npm test                     # jest (unit/component tests, jsdom)
npm run test:e2e              # playwright (e2e; auto-boots dev server). e2e/ currently has no specs yet
npm run test:all               # jest && playwright

npm run commit                 # interactive Commitizen wizard for Conventional Commits
```

Run a single Jest test file: `npx jest path/to/file.test.tsx`. Run a single Playwright spec: `npx playwright test e2e/foo.spec.ts`.

Commits are enforced by commitlint + husky (`commit-msg` hook) and must follow Conventional Commits (`type(scope): subject`, see `docs/commit-convention.md`). `pre-commit` runs `lint-staged` (prettier) on staged files.

**Language of commits and PRs:** titles stay in English, content is in Russian.

- Commit header (`type(scope): subject`) and PR title: English, e.g. `feat(header): show name initial in user avatar`.
- Commit body and PR description: Russian.
- Code identifiers, file paths and commands stay as-is.

## Architecture

### Module structure (`src/modules/*`)

Business logic is split into feature modules (`cart`, `checkout`, `catalog`, `armory`, `constructor`, `auth`, `history`, `mission`, `process`, `home`), each internally layered per `docs/architecture/*`:

- `ui/` — presentational components (own `*.module.css`), receive props only, no data fetching
- `containers/` — wire hooks/store to UI, orchestration
- `hooks/` — module-local React hooks
- `store/` — Redux slice (cart only, currently)
- `dal/` — data-access/persistence (e.g. `cart/dal/cartStorage.ts` wraps localStorage)
- `api/` — server-side data fetchers, typically calling Supabase via `@/shared/api/supabase/server`
- `model/` / `types/` — zod schemas and TS types for the module's domain
- `mappers/`, `services/`, `utils/` — pure transforms and outbound calls (checkout only)

Declared boundary rule (`docs/architecture/overview.md`): UI must not know about the API directly; domain logic must not import React; services hold no business logic. Data flow is `UI → Container → Domain → Service → API`.

A module exposes its public surface via `index.ts` (see `src/modules/cart/index.ts`) — prefer importing through that barrel from outside the module rather than reaching into internal files.

### App Router layout (`src/app`)

- `(auth)/` route group: `/login`, `/register`, server actions in `(auth)/actions.ts` (`'use server'`) that call Supabase auth and map raw Supabase error strings to Russian user-facing messages
- `(main)/` route group: the storefront shell (catalog, cart, account, constructor, static pages) sharing `(main)/layout.tsx`
- `api/orders/route.ts` — order submission endpoint (see below)
- `api/suggestions/city/route.ts` — DaData-backed city autocomplete
- `auth/callback/route.ts` — Supabase OAuth/email callback handler

### State & data

- **Cart**: Redux Toolkit (`src/lib/store.ts` registers only the `cart` reducer), persisted to `localStorage` via `modules/cart/dal/cartStorage.ts` per ADR `docs/decisions/0001-use-localstorage-for-cart.md`. There is no server-side cart.
- **Catalog/products**: fetched server-side from Supabase (`modules/catalog/api/getCatalog.ts`), including a per-user compatibility join against `product_compatibility` keyed by the user's selected weapon platform (see armory module and `docs/migrations/003_weapon_platforms.sql`–`007_seed_compatibility.sql`).
- **Auth**: Supabase, split into a browser client (`shared/api/supabase/client.ts`, `createBrowserClient`) and a server client (`shared/api/supabase/server.ts`, `createServerClient` bound to Next.js `cookies()`). Never mix these — server components/actions use the server client, client components use the browser client.
- **Order submission**: `checkout` module builds an `OrderPayload` client-side (`model/buildOrderPayload.ts`, includes a `crypto.randomUUID()` `clientRequestId`) and posts it to `POST /api/orders`. `docs/api/create-order.md` documents this endpoint as idempotent-by-`clientRequestId` with persisted orders and 409/422 responses, but the current implementation in `src/app/api/orders/route.ts` only validates the payload with zod and forwards it as a Telegram message (`TG_BOT_TOKEN`/`TG_CHAT_ID` env vars) — there is no persistence or idempotency check yet. Treat the docs as the target contract, not the current behavior, when working on this endpoint.
- **Errors**: normalized to `{ message: string, details?: Record<string,string> }` (`ApiError` in `shared/api/apiTypes.ts`, ADR `docs/decisions/0002-api-error-format.md`); `shared/api/httpClient.ts` throws this shape on non-OK responses so hooks can surface `details` as per-field form errors.

### Path aliases & styling

- `@/*` → `src/*` (`tsconfig.json`)
- Component styling mixes Tailwind utility classes with colocated CSS Modules (`Foo.module.css` next to `Foo.tsx`); `identity-obj-proxy` maps `*.module.css` in Jest.
- shadcn/ui generator config lives in `components.json` (new-york style, stone base color, icons from `lucide-react`); generated primitives land in `src/components/ui`.
- `npm run build` enforces a CSS size budget via `scripts/check-css-size.mjs`; a regression here fails the build script (not `next build` itself).

### Docs

`docs/README.md` indexes: architecture (`docs/architecture/`), API contracts (`docs/api/`), per-module specs (`docs/modules/`), and ADRs (`docs/decisions/`). Check the relevant doc before changing cross-cutting behavior in `cart`, `checkout`, or the orders API — and update it if the change makes the doc stale (see the orders-endpoint drift noted above).

Supabase schema evolves via numbered SQL files in `docs/migrations/` (001–007 so far: profiles, weapon platforms, product compatibility, seed data) — treat these as the source of truth for DB shape (`src/types/supabase.ts` is the generated types file).
