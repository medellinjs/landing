/**
 * Pure date utilities shared by calendar export and event display formatting.
 *
 * IMPORTANT: this module never reads or applies event.timezone. All calendar
 * math is done in UTC (see `toCalendarUTC`), and display formatting uses an
 * explicit IANA timezone default of 'America/Bogota' rather than trusting a
 * per-event timezone field.
 */

export const DEFAULT_EVENT_DURATION_MS = 2 * 60 * 60 * 1000

const DEFAULT_TIMEZONE = 'America/Bogota'
const DEFAULT_LOCALE = 'es-CO'

interface EventEndInput {
  startDate: string
  endDate?: string | null
}

/**
 * Resolves the effective end Date for an event.
 *
 * Falls back to `startDate + DEFAULT_EVENT_DURATION_MS` when `endDate` is
 * missing, unparseable, equal to `startDate`, or before `startDate`.
 */
export function getEventEnd(event: EventEndInput): Date {
  const start = new Date(event.startDate)
  const fallback = new Date(start.getTime() + DEFAULT_EVENT_DURATION_MS)

  if (!event.endDate) {
    return fallback
  }

  const end = new Date(event.endDate)

  if (Number.isNaN(end.getTime())) {
    return fallback
  }

  if (end.getTime() <= start.getTime()) {
    return fallback
  }

  return end
}

/**
 * Formats the event date only (no time), e.g. "martes, 10 de marzo de 2026".
 *
 * Verbatim extraction of the logic previously inlined in EventDetail.tsx.
 */
export function formatEventDateOnly(
  dateString: string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: 'full',
    timeZone: timezone,
  }).format(date)
}

/**
 * Formats the event time range (start - end), e.g. "6:30 p. m. - 8:30 p. m.".
 * If `endDate` is not provided, only the start time is returned.
 *
 * Verbatim extraction of the logic previously inlined in EventDetail.tsx.
 */
export function formatEventTimeRange(
  startDate: string,
  endDate: string | null | undefined,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const start = new Date(startDate)
  const startTime = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    timeStyle: 'short',
    timeZone: timezone,
  }).format(start)

  if (!endDate) return startTime

  const end = new Date(endDate)
  const endTime = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    timeStyle: 'short',
    timeZone: timezone,
  }).format(end)

  return `${startTime} - ${endTime}`
}

/**
 * Formats a full date + time in a single Intl call, e.g.
 * "martes, 10 de marzo de 2026, 6:30 p. m.".
 *
 * Verbatim extraction of the logic previously inlined in EventCard.tsx.
 * NOTE: this combines dateStyle + timeStyle in ONE Intl.DateTimeFormat call,
 * which is a different shape from formatEventDateOnly/formatEventTimeRange
 * (two separate formatters) — do not merge these functions.
 */
export function formatEventDateTime(
  dateString: string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date)
}

/**
 * Formats a Date (or date string) as the UTC calendar format required by
 * ICS/Google Calendar URLs: `YYYYMMDDTHHMMSSZ`.
 */
export function toCalendarUTC(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const pad = (n: number) => String(n).padStart(2, '0')

  const year = d.getUTCFullYear()
  const month = pad(d.getUTCMonth() + 1)
  const day = pad(d.getUTCDate())
  const hours = pad(d.getUTCHours())
  const minutes = pad(d.getUTCMinutes())
  const seconds = pad(d.getUTCSeconds())

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}
