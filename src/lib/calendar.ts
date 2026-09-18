import { getEventEnd, toCalendarUTC } from '@/lib/dates'

/**
 * Minimal, deliberately flat input shape for calendar builders.
 *
 * IMPORTANT: this interface has NO timezone field on purpose. All calendar
 * math (Google Calendar URL, ICS content) is computed in UTC via
 * `toCalendarUTC`. Passing event.timezone here would risk a double-offset
 * bug (the source Date is already UTC-based; applying a timezone offset on
 * top of that would shift the calendar entry incorrectly).
 */
export interface CalendarEventInput {
  eventId: string
  title: string
  startDate: string
  endDate?: string | null
  venueName?: string | null
  venueUrl?: string | null
  slug?: string | null
  origin: string
  /**
   * Plain-text excerpt of the event description, already extracted from any
   * rich text source. `calendar.ts` stays decoupled from Lexical/Payload
   * types on purpose, so this is a plain string, not rich text.
   */
  descriptionExcerpt?: string
}

/**
 * Prefix applied to every calendar event title so entries created from
 * MedellinJS are easily recognizable in a user's calendar.
 */
export const CALENDAR_TITLE_PREFIX = '[MedellinJS] '

/**
 * Builds the calendar event title with the MedellinJS prefix applied.
 */
export function buildCalendarTitle(input: CalendarEventInput): string {
  return `${CALENDAR_TITLE_PREFIX}${input.title}`
}

/**
 * Builds the absolute event detail URL: `${origin}/events/${slug}`.
 * Falls back to `${origin}/events/${eventId}` when slug is not present.
 */
export function buildEventUrl(input: CalendarEventInput): string {
  const path = input.slug || input.eventId
  return `${input.origin}/events/${path}`
}

/**
 * Builds the calendar "location" field from venue name + optional URL.
 * Never returns an empty string or the literal "undefined".
 */
export function buildCalendarLocation(input: CalendarEventInput): string {
  const venueName = input.venueName?.trim() || 'Por confirmar'

  if (input.venueUrl) {
    return `${venueName} (${input.venueUrl})`
  }

  return venueName
}

/**
 * Builds the calendar description: when a `descriptionExcerpt` is provided,
 * it is prepended to the absolute event URL; otherwise falls back to a
 * link-only summary. Deliberately NOT the serialized Lexical rich text
 * description — callers must pass an already-extracted plain-text excerpt.
 */
export function buildCalendarDescription(input: CalendarEventInput): string {
  const url = buildEventUrl(input)

  if (input.descriptionExcerpt) {
    return `${input.descriptionExcerpt}\n\nMás información y registro: ${url}`
  }

  return `Más detalles e información de registro: ${url}`
}

/**
 * Builds a Google Calendar "render" (TEMPLATE) event creation URL.
 */
export function buildGoogleCalendarUrl(input: CalendarEventInput): string {
  const start = new Date(input.startDate)
  const end = getEventEnd(input)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: buildCalendarTitle(input),
    dates: `${toCalendarUTC(start)}/${toCalendarUTC(end)}`,
    details: buildCalendarDescription(input),
    location: buildCalendarLocation(input),
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Escapes text per RFC 5545 (iCalendar) TEXT value rules.
 *
 * Order matters: backslash MUST be escaped first, otherwise the backslashes
 * introduced while escaping `;`, `,`, and newlines would themselves get
 * double-escaped.
 */
export function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/**
 * Builds the ICS UID for an event: `event-${eventId}@medellinjs.org`.
 */
export function buildIcsUid(eventId: string): string {
  return `event-${eventId}@medellinjs.org`
}

/**
 * Builds the download filename for the .ics file.
 */
export function buildIcsFilename(input: CalendarEventInput): string {
  const base = input.slug || input.eventId
  return `${base}.ics`
}

const ICS_LINE_BREAK = '\r\n'

/**
 * Builds a full ICS (RFC 5545) calendar file content for a single event.
 *
 * `now` is injectable for deterministic DTSTAMP values in tests; defaults to
 * `new Date()`.
 */
export function buildIcsContent(input: CalendarEventInput, now: Date = new Date()): string {
  const start = new Date(input.startDate)
  const end = getEventEnd(input)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MedellinJS//Event Calendar//ES',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${buildIcsUid(input.eventId)}`,
    `DTSTAMP:${toCalendarUTC(now)}`,
    `DTSTART:${toCalendarUTC(start)}`,
    `DTEND:${toCalendarUTC(end)}`,
    `SUMMARY:${escapeIcsText(buildCalendarTitle(input))}`,
    `LOCATION:${escapeIcsText(buildCalendarLocation(input))}`,
    `DESCRIPTION:${escapeIcsText(buildCalendarDescription(input))}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio de evento',
    'TRIGGER:-PT1H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join(ICS_LINE_BREAK) + ICS_LINE_BREAK
}
