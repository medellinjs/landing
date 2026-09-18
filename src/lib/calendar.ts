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
 * Builds a short calendar description: a one-line summary plus the absolute
 * event URL. Deliberately NOT the serialized Lexical rich text description.
 */
export function buildCalendarDescription(input: CalendarEventInput): string {
  const url = buildEventUrl(input)
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
    text: input.title,
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
    `SUMMARY:${escapeIcsText(input.title)}`,
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
