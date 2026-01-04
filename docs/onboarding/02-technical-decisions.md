## Technical Decisions

This document explains the main technical choices in this repo and the rationale behind them.

## Why Next.js + Payload in the same app

- **Single deployable**: the public site and CMS ship together (simpler ops, one codebase, one runtime).
- **First-class SSR/ISR**: event listing and detail pages can use server rendering + ISR for performance and freshness.
- **Shared types**: Payload generates `src/payload-types.ts` so frontend/server actions can be strongly typed.

## Content model and boundaries

Payload is used as the source of truth for:

- **Events** (including embedded venue info and embedded attendees array)
- **Speakers** (separate collection; reusable across events)
- **Media** (uploads used for event and speaker images)
- **Members** (community members that can register for events)
- **Users** (Payload Admin auth)

Rationale:

- **Events/Speakers** are editorial content, best managed via admin UI.
- **Attendees** are treated as **display-only** embedded data on events (simple social proof, not a full identity system).

## “Parser system” / input validation layer

There is no dedicated “parser” module in the codebase today, but the project does implement a consistent **input parsing and validation** layer:

- **Zod schemas** validate request bodies for custom API routes:
  - `/api/talk`: validates talk submission payload before writing to Airtable and sending email
  - `/api/subscribe`: validates newsletter subscription payload before adding to Resend
- **Token decoding (non-verifying)** exists in the Payload user helper, followed by a database lookup to confirm the user exists.

Rationale:

- **Fail fast** on invalid inputs at the boundary (HTTP handlers).
- Keep payload structures explicit and reusable (schema-first validation).

## Data access patterns

### Payload Local API for server-side operations

Server-side code uses Payload’s Local API (`getPayload({ config })`) for:

- Fetching event documents (including relationship population via `depth`)
- Creating members and updating event attendee arrays (registration flows)

Rationale:

- One consistent API surface across server actions and server components.
- Strong TS types via `payload-types.ts`.

### Relationship depth

When rendering event detail pages, queries often use `depth: 2` to populate speakers and media.

Rationale:

- Keeps frontend code simpler (fewer follow-up queries).
- Tradeoff: deeper population is more expensive; keep it bounded and consider `depth: 0` for list pages if performance becomes a concern.

## Error handling strategy

Two main styles exist in this repo:

- **API Routes** (`src/app/api/*`): return HTTP status codes and structured JSON error responses (validation errors -> `400`).
- **Server Actions** (`src/actions/*`): return typed “result” objects (success/failure) rather than throwing, and log with `pino`.

Rationale:

- UI can render errors without relying on exception control flow.
- Logs remain consistent and searchable.

## Auth strategy

- **Payload Admin auth** controls access to `/admin` and write operations in collections.
- **NextAuth (LinkedIn)** is configured for “dashboard” style routes guarded by middleware.

Rationale:

- Payload’s built-in auth is best for content editors/admins.
- NextAuth is better suited for community member login flows and social providers.

## Security considerations (Payload-specific)

- **Access control matters**: make sure collection access rules enforce that public users only read published content.
- **Local API gotcha**: when passing a `user` to Payload Local API calls, you must set `overrideAccess: false` if you intend to enforce permissions. By default, Local API calls bypass access control.

## Testing strategy

- **Integration / unit**: Vitest (`tests/int`)
- **End-to-end**: Playwright (`tests/e2e`)

Rationale:

- Vitest covers server-side behaviors and utilities quickly.
- Playwright validates real user paths in the browser.

## Operational decisions

- **Generated artifacts**:
  - `src/payload-types.ts` is generated via `pnpm generate:types`
  - `src/app/(payload)/admin/importMap.js` is generated via `pnpm generate:importmap`
- **Database**: Vercel Postgres via `POSTGRES_URL`
- **Email**: Resend integration via `RESEND_API_KEY`
- **Talk intake**: Airtable integration via `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`


