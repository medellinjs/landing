## Project Overview

This repository powers the **MedellínJS website** and its **events platform**.

It combines:

- A **public website** (Next.js App Router) for community pages + event discovery (`/events`, `/events/[slug]`)
- A **Payload CMS Admin** embedded in the same Next.js app (`/admin`) to manage content (events, speakers, media, members)
- A small set of **integration APIs** (talk submissions, newsletter subscription) that connect to external services (Airtable, Resend)

## Architecture (high level)

```mermaid
flowchart LR
  %% Clients
  U[Public visitors] -->|Browse| FE[Next.js Frontend\nsrc/app/(frontend)]
  A[Organizers/Admins] -->|Manage content| ADM[Payload Admin UI\n/admin]

  %% Core server/app
  FE -->|Server Components / Server Actions| APP[Next.js + Payload Runtime]
  ADM --> APP

  %% Payload APIs
  FE -->|Read events| REST[Payload REST API\n/app/(payload)/api/[...slug]]
  FE -->|Optional| GQL[Payload GraphQL API\n/app/(payload)/api/graphql]
  REST --> APP
  GQL --> APP

  %% Data store + media processing
  APP --> DB[(Vercel Postgres)]
  APP --> IMG[Sharp image processing]

  %% Integrations
  FE -->|POST /api/talk| TALK[API Route: Talk submission\nsrc/app/api/talk]
  FE -->|POST /api/subscribe| NEWS[API Route: Newsletter\nsrc/app/api/subscribe]

  TALK -->|Validate/parse (Zod)| PARSER[Input parsing & validation]
  NEWS -->|Validate/parse (Zod)| PARSER
  PARSER --> AIR[Airtable\nTalks table]
  PARSER --> RES[Resend\nContacts + Emails]
```

### Key interactions

- **Public event browsing**: frontend pages fetch events from Payload (server-side) and render via React components.
- **Admin content management**: organizers log into `/admin` and create/update Events/Speakers/Media.
- **Event registration (server actions)**: server-side actions orchestrate member creation + attendee registration using the Payload Local API.
- **Talk submissions**: `/api/talk` validates request payload (Zod), writes to Airtable, and sends confirmation email via Resend.
- **Newsletter subscription**: `/api/subscribe` validates payload (Zod) and adds email to Resend audience.

## Technology stack

- **Runtime/UI**: Next.js (App Router), React, TypeScript
- **CMS**: Payload CMS (v3) with Lexical rich-text editor
- **Database**: Vercel Postgres (Payload Postgres adapter)
- **Media**: Sharp (image processing)
- **Auth**:
  - Payload Auth for admin users (`/admin`)
  - NextAuth (LinkedIn provider) for site “dashboard” routes (if used)
- **Validation (“parser system”)**: Zod schemas used to parse/validate API payloads
- **Email & contacts**: Resend
- **Talk intake**: Airtable
- **Testing**: Vitest (integration/unit), Playwright (e2e)

## Project structure

```text
.
├── docs/
│   └── onboarding/                 # (this directory) onboarding docs
├── src/
│   ├── app/
│   │   ├── (frontend)/             # Public website routes
│   │   ├── (payload)/              # Payload Admin + Payload REST/GraphQL routes
│   │   └── api/                    # Custom Next.js API routes (talk/newsletter)
│   ├── actions/                    # Next.js Server Actions (event + member flows)
│   ├── collections/                # Payload collection configs (Events, Speakers, etc.)
│   ├── components/                 # UI components used by frontend routes
│   ├── emailTemplates/             # React Email templates
│   ├── lib/                        # Shared utilities (Payload helpers, Resend/Airtable clients)
│   ├── payload-types.ts            # Generated Payload TS types (do not edit manually)
│   └── payload.config.ts           # Payload config (collections, db adapter, admin, etc.)
├── tests/
│   ├── int/                        # Vitest integration tests
│   └── e2e/                        # Playwright tests
└── package.json
```

## Component relationships (simplified)

```mermaid
flowchart TB
  PAGES[Next.js Pages\nsrc/app/(frontend)] --> UI[Shared UI Components\nsrc/components]
  PAGES --> ACTIONS[Server Actions\nsrc/actions]
  ACTIONS --> PAYLOAD[Payload Local API\ngetPayload + payload config]
  UI --> LIB[Shared libs\nsrc/lib]
  LIB --> EXT[External Services\nResend / Airtable]

  PAYLOAD --> COLLS[Collections\nsrc/collections]
  PAYLOAD --> DB[(Postgres)]
```


