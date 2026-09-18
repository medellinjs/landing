// @vitest-environment node
//
// Payload's local `login()` operation signs JWTs via `jose`, which does a
// `payload instanceof Uint8Array` check internally. Under the global jsdom
// environment (needed by component specs elsewhere in this project), jsdom's
// realm provides its own `TextEncoder`/`Uint8Array` globals, which are a
// DIFFERENT class from Node's — so that `instanceof` check fails with
// "payload must be an instance of Uint8Array". Forcing the Node environment
// for this integration test file (which never touches the DOM) avoids that
// realm mismatch.
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, afterEach, expect, vi } from 'vitest'
import { GET } from '@/app/(frontend)/events/[slug]/attendees.csv/route'
import { buildAttendeesCsv } from '@/lib/csv'

let payload: Payload

/**
 * Unique per-run suffix so repeated local/CI runs against the shared Neon
 * database never collide on the `users.email` unique constraint.
 */
const runId = Date.now()
const TEST_USER_EMAIL = `attendees-csv-test-${runId}@medellinjs.org`
const TEST_USER_PASSWORD = 'a-strong-test-password-123'

let testUserId: number | undefined

describe('attendees-csv auth harness', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const user = await payload.create({
      collection: 'users',
      data: {
        name: 'Attendees CSV Test User',
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        role: 'admin',
      },
    })
    testUserId = user.id
  })

  afterAll(async () => {
    if (testUserId) {
      await payload.delete({ collection: 'users', id: testUserId })
    }
  })

  it('authenticates via payload.auth() given a hand-built Request with a payload-token cookie', async () => {
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    })

    expect(loginResult.token).toBeDefined()

    const request = new Request('http://localhost/events/some-event-slug/attendees.csv', {
      headers: {
        Cookie: `payload-token=${loginResult.token}`,
      },
    })

    const authResult = await payload.auth({ headers: request.headers })

    expect(authResult.user).not.toBeNull()
    expect(authResult.user?.email).toBe(TEST_USER_EMAIL)
  })
})

/** Minimal valid Lexical richText value accepted by the `Events.description` field. */
const minimalRichText = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Test event description', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
}

function buildCookieHeader(token: string): string {
  return `payload-token=${token}`
}

describe('GET /events/[slug]/attendees.csv', () => {
  const routeRunId = Date.now()
  const ADMIN_EMAIL = `attendees-csv-route-${routeRunId}@medellinjs.org`
  const ADMIN_PASSWORD = 'a-strong-test-password-456'

  let adminUserId: number
  let authCookie: string
  let memberOneId: number
  let memberTwoId: number
  let eventWithoutAttendeesId: number
  let eventWithAttendeesId: number
  let eventSlugWithoutAttendees: string
  let eventSlugWithAttendees: string

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const admin = await payload.create({
      collection: 'users',
      data: {
        name: 'Attendees CSV Route Test Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      },
    })
    adminUserId = admin.id

    const loginResult = await payload.login({
      collection: 'users',
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    authCookie = buildCookieHeader(loginResult.token as string)

    const memberOne = await payload.create({
      collection: 'members',
      data: {
        fullName: 'Ana Gomez',
        email: `ana-${routeRunId}@example.com`,
        jobPosition: 'Frontend Developer',
        jobLevel: 'SENIOR',
        role: 'MEMBER',
        bio: 'MARKER_SHOULD_NOT_APPEAR_IN_CSV',
      },
    })
    memberOneId = memberOne.id

    const memberTwo = await payload.create({
      collection: 'members',
      data: {
        fullName: 'Luis Ruiz',
        email: `luis-${routeRunId}@example.com`,
        jobPosition: 'Product Manager',
        jobLevel: 'LEAD',
        role: 'ORGANIZER',
      },
    })
    memberTwoId = memberTwo.id

    const eventWithoutAttendees = await payload.create({
      collection: 'events',
      data: {
        title: `Attendees CSV Test Event (no attendees) ${routeRunId}`,
        eventType: 'charla',
        description: minimalRichText,
        startDate: new Date().toISOString(),
        timezone: 'America/Bogota',
        venue: { name: 'Virtual' },
        isPublished: false,
      },
    })
    eventWithoutAttendeesId = eventWithoutAttendees.id
    eventSlugWithoutAttendees = eventWithoutAttendees.slug ?? String(eventWithoutAttendees.id)

    const eventWithAttendees = await payload.create({
      collection: 'events',
      data: {
        title: `Attendees CSV Test Event (with attendees) ${routeRunId}`,
        eventType: 'charla',
        description: minimalRichText,
        startDate: new Date().toISOString(),
        timezone: 'America/Bogota',
        venue: { name: 'Virtual' },
        isPublished: false,
        attendees: [memberOneId, memberTwoId],
      },
    })
    eventWithAttendeesId = eventWithAttendees.id
    eventSlugWithAttendees = eventWithAttendees.slug ?? String(eventWithAttendees.id)
  })

  afterAll(async () => {
    await payload.delete({ collection: 'events', id: eventWithoutAttendeesId })
    await payload.delete({ collection: 'events', id: eventWithAttendeesId })
    await payload.delete({ collection: 'members', id: memberOneId })
    await payload.delete({ collection: 'members', id: memberTwoId })
    await payload.delete({ collection: 'users', id: adminUserId })
  })

  function buildRequest(slugParam: string, cookie?: string): Request {
    return new Request(`http://localhost/events/${slugParam}/attendees.csv`, {
      headers: cookie ? { Cookie: cookie } : {},
    })
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 401 when the request has no auth cookie', async () => {
    const response = await GET(buildRequest(eventSlugWithoutAttendees), {
      params: Promise.resolve({ slug: eventSlugWithoutAttendees }),
    })
    expect(response.status).toBe(401)
  })

  it('returns 404 for an unknown event slug', async () => {
    const unknownSlug = `unknown-event-slug-${routeRunId}`
    const response = await GET(buildRequest(unknownSlug, authCookie), {
      params: Promise.resolve({ slug: unknownSlug }),
    })
    expect(response.status).toBe(404)
  })

  it('returns 200 with header-only CSV for an event with zero attendees', async () => {
    const response = await GET(buildRequest(eventSlugWithoutAttendees, authCookie), {
      params: Promise.resolve({ slug: eventSlugWithoutAttendees }),
    })
    expect(response.status).toBe(200)
    const body = await response.text()
    expect(body).toBe(buildAttendeesCsv([]))
  })

  it('returns 200 with exact attendee rows and a Content-Disposition filename for a populated event', async () => {
    const response = await GET(buildRequest(eventSlugWithAttendees, authCookie), {
      params: Promise.resolve({ slug: eventSlugWithAttendees }),
    })
    expect(response.status).toBe(200)

    const body = await response.text()
    expect(body).toBe(
      buildAttendeesCsv([
        {
          fullName: 'Ana Gomez',
          email: `ana-${routeRunId}@example.com`,
          role: 'MEMBER',
          jobPosition: 'Frontend Developer',
        },
        {
          fullName: 'Luis Ruiz',
          email: `luis-${routeRunId}@example.com`,
          role: 'ORGANIZER',
          jobPosition: 'Product Manager',
        },
      ]),
    )

    const contentDisposition = response.headers.get('Content-Disposition')
    expect(contentDisposition).toMatch(
      /^attachment; filename="[\w-]+-attendees-\d{4}-\d{2}-\d{2}\.csv"$/,
    )
    expect(contentDisposition).toBe(
      `attachment; filename="${eventSlugWithAttendees}-attendees-${new Date().toISOString().slice(0, 10)}.csv"`,
    )
    expect(response.headers.get('Content-Type')).toBe('text/csv; charset=utf-8')
  })

  it('never includes a member field that is not part of the exported CSV columns (regression guard against leaking extra PII)', async () => {
    const response = await GET(buildRequest(eventSlugWithAttendees, authCookie), {
      params: Promise.resolve({ slug: eventSlugWithAttendees }),
    })
    expect(response.status).toBe(200)

    const body = await response.text()
    expect(body).not.toContain('MARKER_SHOULD_NOT_APPEAR_IN_CSV')
  })

  it('returns a clean 500 with no leaked details when an unexpected error occurs during export', async () => {
    // `payload.auth()` internally calls `payload.findByID` (to look up the
    // `users` collection), so the mock must only throw for the `events`
    // lookup made by the route itself — otherwise it would break auth too.
    const originalFind = payload.find.bind(payload)
    const findSpy = vi
      .spyOn(payload, 'find')
      .mockImplementation(async (args: Parameters<typeof originalFind>[0]) => {
        if (args.collection === 'events') {
          throw new Error('simulated DB failure')
        }
        return originalFind(args)
      })
    const loggerErrorSpy = vi.spyOn(payload.logger, 'error').mockImplementation(() => undefined)

    const response = await GET(buildRequest(eventSlugWithAttendees, authCookie), {
      params: Promise.resolve({ slug: eventSlugWithAttendees }),
    })

    expect(response.status).toBe(500)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    const body = await response.text()
    expect(body).toBe('')
    expect(loggerErrorSpy).toHaveBeenCalled()

    findSpy.mockRestore()
  })

  it('skips invalid/incomplete attendee entries while still exporting valid ones, given a mix of both', async () => {
    // Members.role and Members.jobPosition are `required: true`, so a
    // genuinely malformed attendee cannot be seeded through normal
    // `payload.create`. Instead, `payload.find` is stubbed for this one
    // test to return a synthetic mix of one valid and one malformed
    // attendee, exercising the route's skip-and-log path end-to-end.
    const validAttendee = {
      id: memberOneId,
      fullName: 'Ana Gomez',
      email: `ana-${routeRunId}@example.com`,
      role: 'MEMBER',
      jobPosition: 'Frontend Developer',
    }
    const malformedAttendee = {
      id: memberTwoId,
      fullName: 'Luis Ruiz',
      email: `luis-${routeRunId}@example.com`,
      role: 'ORGANIZER',
      // jobPosition intentionally missing to simulate malformed/incomplete data
    }

    // Same reasoning as above: only stub the `events` lookup, pass every
    // other collection (notably `users`, used internally by `payload.auth`)
    // through to the real implementation.
    const originalFind = payload.find.bind(payload)
    const findSpy = vi
      .spyOn(payload, 'find')
      .mockImplementation(async (args: Parameters<typeof originalFind>[0]) => {
        if (args.collection === 'events') {
          return {
            docs: [
              {
                id: eventWithAttendeesId,
                slug: eventSlugWithAttendees,
                attendees: [validAttendee, malformedAttendee],
              },
            ],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any
        }
        return originalFind(args)
      })
    const loggerWarnSpy = vi.spyOn(payload.logger, 'warn').mockImplementation(() => undefined)

    const response = await GET(buildRequest(eventSlugWithAttendees, authCookie), {
      params: Promise.resolve({ slug: eventSlugWithAttendees }),
    })

    expect(response.status).toBe(200)
    const body = await response.text()
    expect(body).toBe(
      buildAttendeesCsv([
        {
          fullName: 'Ana Gomez',
          email: `ana-${routeRunId}@example.com`,
          role: 'MEMBER',
          jobPosition: 'Frontend Developer',
        },
      ]),
    )
    expect(body).not.toContain('Luis Ruiz')
    expect(loggerWarnSpy).toHaveBeenCalled()

    findSpy.mockRestore()
  })

  // NOTE on the "broken relation" scenario (task 3.6): Postgres FK constraints on
  // the `events_rels` join table prevent deleting a `members` row that is still
  // referenced by an event's `attendees` relationship — attempting it raises a
  // foreign key violation, so a true DB-level dangling-relation scenario could
  // not be constructed in this integration test without either disabling FK
  // enforcement or hand-crafting raw SQL against the join table (out of scope
  // here). Instead, the attendee-filtering predicate (`isPopulatedAttendee`)
  // that would guard against this case is extracted as a pure function and
  // unit-tested directly with fabricated malformed input (see
  // `src/lib/csv.spec.ts` → `describe('isPopulatedAttendee', ...)`), proving
  // the filtering logic itself works without needing a live broken FK.
})
