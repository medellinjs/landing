## Getting Started

This guide gets a new developer running the MedellínJS site + Payload Admin locally.

## Prerequisites

- **Node.js**: `^18.20.2` or `>=20.9.0`
- **pnpm**: `^9` or `^10`

## Install dependencies

```bash
pnpm install
```

## Environment variables

Create `.env.local` in the repo root.

### Required (core app)

- **`PAYLOAD_SECRET`**: required by Payload for session/JWT signing
- **`POSTGRES_URL`**: Vercel Postgres connection string used by Payload

### Optional (features)

- **NextAuth (LinkedIn)**
  - `AUTH_SECRET`
  - `LINKEDIN_CLIENT_ID`
  - `LINKEDIN_CLIENT_SECRET`
- **Resend**
  - `RESEND_API_KEY`
  - `BASE_URL` (used in email templates; defaults to `http://localhost:3000`)
- **Airtable (talk intake)**
  - `AIRTABLE_API_KEY`
  - `AIRTABLE_BASE_ID`

## Run in development

```bash
pnpm dev
```

Then open:

- Public site: `http://localhost:3000`
- Payload Admin: `http://localhost:3000/admin`

## Common workflows

### Update collections / schema

After changing any Payload collection config:

```bash
pnpm generate:types
```

### Update admin components / import map

If you add or change custom admin component paths:

```bash
pnpm generate:importmap
```

### Run tests

```bash
pnpm test:int
pnpm test:e2e
pnpm test
```

### Email template development

Runs the email preview/dev server:

```bash
pnpm email
```

## Build and run production locally

```bash
pnpm build
pnpm start
```

## Database and Payload operations

The `pnpm payload` script proxies the Payload CLI:

```bash
pnpm payload --help
```

Common tasks:

- **Generate types**: `pnpm payload generate:types` (or `pnpm generate:types`)
- **Generate import map**: `pnpm payload generate:importmap` (or `pnpm generate:importmap`)
- **Run migrations** (if you use them): `pnpm payload migrate`

## Troubleshooting

- **Can’t log into `/admin`**: confirm `PAYLOAD_SECRET` is set and `POSTGRES_URL` points to a reachable database.
- **Talk submission fails**: confirm Airtable env vars exist, and that the table name matches the code (`Talks`).
- **Emails not sending**: confirm `RESEND_API_KEY` is set and the sender domain is configured in Resend.


