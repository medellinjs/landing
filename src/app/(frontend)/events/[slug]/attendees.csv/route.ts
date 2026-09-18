import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

import {
  buildAttendeesCsv,
  buildAttendeesCsvFilename,
  isPopulatedAttendee,
  hasAllowedRole,
  type AttendeeCsvRow,
} from '@/lib/csv'

export const dynamic = 'force-dynamic'

const ALLOWED_ROLES = ['admin', 'organizer']

/**
 * Exports the confirmed attendees of an event as a CSV file.
 *
 * Auth: requires an authenticated `admin` or `organizer` user (401 otherwise).
 * The `[slug]` param identifies the event by its `slug` field (matching the
 * public event page's URL shape at `/events/[slug]`). An unknown/empty slug
 * resolves to 404 — never a 400 or a leaked lookup error.
 *
 * Any unexpected failure (DB timeout, connection error, etc.) is caught,
 * logged server-side only, and surfaced to the client as a bare 500 with no
 * body — never leaking stack traces or error details.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  let payload: Payload | undefined

  try {
    payload = await getPayload({ config })

    const { user } = await payload.auth({ headers: request.headers })

    // NOTE: today, `Users.role` only allows `admin`/`organizer` (both in
    // ALLOWED_ROLES), so this "authenticated but disallowed role" branch is
    // currently unreachable via real data. It's defensively correct and
    // unit-tested in isolation (`hasAllowedRole` in `src/lib/csv.spec.ts`),
    // so a future role addition stays protected.
    if (!user || !hasAllowedRole(user.role, ALLOWED_ROLES)) {
      return new Response(null, { status: 401 })
    }

    const { slug } = await params

    if (!slug) {
      return new Response(null, { status: 404 })
    }

    const result = await payload.find({
      collection: 'events',
      where: { slug: { equals: slug } },
      limit: 1,
      disableErrors: true,
      depth: 1,
      overrideAccess: false,
      user,
    })

    const event = result.docs[0]

    if (!event) {
      return new Response(null, { status: 404 })
    }

    const rawAttendees = event.attendees ?? []
    const rows: AttendeeCsvRow[] = []

    for (const attendee of rawAttendees) {
      if (isPopulatedAttendee(attendee)) {
        rows.push({
          fullName: attendee.fullName,
          email: attendee.email,
          role: attendee.role,
          jobPosition: attendee.jobPosition,
        })
      } else {
        payload.logger.warn(
          `Skipping invalid/unpopulated attendee entry on event ${event.id} while exporting attendees CSV`,
        )
      }
    }

    const csv = buildAttendeesCsv(rows)
    const filename = buildAttendeesCsvFilename(event.slug ?? `event-${event.id}`)

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (payload) {
      payload.logger.error(`Error exporting attendees CSV: ${message}`)
    } else {
      console.error(`Error exporting attendees CSV (payload unavailable): ${message}`)
    }

    return new Response(null, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }
}
