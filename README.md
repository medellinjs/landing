# MedellínJS Web + Admin (Payload CMS)

This repository contains the **public MedellínJS website** (Next.js) and an **events platform** managed via **Payload CMS** (Admin at `/admin`).

## Documentation / Onboarding

Onboarding docs live in `docs/onboarding/`:

- `docs/onboarding/01-project-overview.md` (architecture, diagrams, structure)
- `docs/onboarding/02-technical-decisions.md` (technical decisions, patterns, testing)
- `docs/onboarding/03-getting-started.md` (setup, env vars, workflows)

## Architecture (summary)

```mermaid
flowchart LR
  U[Users] --> FE[Next.js Frontend\nsrc/app/(frontend)]
  O[Organizers] --> ADM[Payload Admin\n/admin]

  FE --> APP[Next.js + Payload Runtime]
  ADM --> APP

  APP --> DB[(Vercel Postgres)]
  APP --> IMG[Sharp (images)]

  FE --> TALK[/api/talk\nAirtable + Resend/]
  FE --> NEWS[/api/subscribe\nResend/]
```

## Tech stack (current)

- **Framework**: Next.js (App Router)
- **Language**: TypeScript + React
- **CMS**: Payload CMS v3 (embedded Admin at `/admin`, embedded REST/GraphQL routes)
- **DB**: Postgres (Vercel Postgres adapter)
- **Styling**: Tailwind CSS + SCSS (includes `src/app/(payload)/custom.scss`)
- **Images**: Sharp
- **Integrations**: Airtable (talk submissions), Resend (emails/contacts)
- **Testing**: Vitest (int), Playwright (e2e)
- **Auth**:
  - Payload Auth for Admin
  - NextAuth (LinkedIn) for middleware-protected routes (`/dashboard/*`)

## Project structure (high-signal)

```text
.
├── docs/
│   └── onboarding/                 # Onboarding (new)
├── src/
│   ├── app/
│   │   ├── (frontend)/             # Public routes
│   │   ├── (payload)/              # Payload Admin + REST/GraphQL routes
│   │   └── api/                    # API routes: talk / subscribe
│   ├── actions/                    # Server Actions (event/member flows)
│   ├── collections/                # Payload collections (Events, Speakers, etc.)
│   ├── components/                 # UI components
│   ├── emailTemplates/             # React Email templates
│   ├── lib/                        # Resend/Airtable/Payload helpers, etc.
│   └── payload.config.ts           # Configuración Payload
├── tests/
│   ├── int/                        # Vitest
│   └── e2e/                        # Playwright
└── package.json
```

## Getting started (quick)

Requirements:

- Node.js `^18.20.2` or `>=20.9.0`
- pnpm `^9` or `^10`

Install + dev:

```bash
pnpm install
pnpm dev
```

URLs:

- Public site: `http://localhost:3000`
- Admin (Payload): `http://localhost:3000/admin`

> For full setup (env vars, workflows, troubleshooting), see `docs/onboarding/03-getting-started.md`.

## Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` (if present) and open a PR with a clear description of the change.

## License

MIT (see `package.json`).

## Contact

- **Community**: MedellínJS
- **Email**: `contacto@medellinjs.org`
- **Web**: `https://medellinjs.org`
