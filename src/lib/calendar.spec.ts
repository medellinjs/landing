import { describe, it, expect } from 'vitest'
import {
  escapeIcsText,
  buildCalendarLocation,
  buildGoogleCalendarUrl,
  buildEventUrl,
  buildIcsUid,
  buildIcsContent,
  buildIcsFilename,
  type CalendarEventInput,
} from './calendar'

describe('escapeIcsText', () => {
  it('escapes backslash first, then semicolon, comma, and newline (in that order)', () => {
    const input = 'a\\b;c,d\ne'
    // If backslash were escaped AFTER the others, the backslashes introduced
    // by escaping ; , and \n would themselves get escaped again — wrong.
    expect(escapeIcsText(input)).toBe('a\\\\b\\;c\\,d\\ne')
  })
})

describe('buildCalendarLocation', () => {
  const baseInput: CalendarEventInput = {
    eventId: '1',
    title: 'MedellínJS Meetup',
    startDate: '2026-03-10T23:30:00.000Z',
    origin: 'https://medellinjs.org',
  }

  it('returns "venue name (venue url)" when venue has a URL', () => {
    const result = buildCalendarLocation({
      ...baseInput,
      venueName: 'Ruta N',
      venueUrl: 'https://maps.google.com/ruta-n',
    })
    expect(result).toBe('Ruta N (https://maps.google.com/ruta-n)')
  })

  it('returns just the venue name when there is no URL', () => {
    const result = buildCalendarLocation({
      ...baseInput,
      venueName: 'Virtual',
      venueUrl: null,
    })
    expect(result).toBe('Virtual')
  })

  it('returns the venue name with URL for a virtual venue with a URL', () => {
    const result = buildCalendarLocation({
      ...baseInput,
      venueName: 'Virtual - Zoom',
      venueUrl: 'https://zoom.us/j/12345',
    })
    expect(result).toBe('Virtual - Zoom (https://zoom.us/j/12345)')
  })

  it('never returns an empty string or the literal "undefined" when venue data is missing', () => {
    const result = buildCalendarLocation({
      ...baseInput,
      venueName: undefined,
      venueUrl: undefined,
    })
    expect(result).not.toBe('')
    expect(result).not.toContain('undefined')
  })
})

describe('buildGoogleCalendarUrl', () => {
  const input: CalendarEventInput = {
    eventId: '42',
    title: 'MedellínJS Meetup',
    startDate: '2026-03-10T23:30:00.000Z',
    endDate: '2026-03-11T01:30:00.000Z',
    venueName: 'Ruta N',
    venueUrl: 'https://maps.google.com/ruta-n',
    slug: 'medellinjs-meetup',
    origin: 'https://medellinjs.org',
  }

  it('builds a URL with dates in YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ format', () => {
    const url = buildGoogleCalendarUrl(input)
    const parsed = new URL(url)
    expect(parsed.searchParams.get('dates')).toBe('20260310T233000Z/20260311T013000Z')
  })

  it('includes action, text, dates, details, and location params, all URL-encoded', () => {
    const url = buildGoogleCalendarUrl(input)
    const parsed = new URL(url)
    expect(parsed.searchParams.get('action')).toBe('TEMPLATE')
    expect(parsed.searchParams.get('text')).toBe('MedellínJS Meetup')
    expect(parsed.searchParams.get('dates')).toBeTruthy()
    expect(parsed.searchParams.get('details')).toContain(
      'https://medellinjs.org/events/medellinjs-meetup',
    )
    expect(parsed.searchParams.get('location')).toBe('Ruta N (https://maps.google.com/ruta-n)')
  })
})

describe('buildEventUrl', () => {
  it('builds an absolute /events/[slug] URL from origin and slug', () => {
    expect(
      buildEventUrl({
        eventId: '1',
        title: 'x',
        startDate: '2026-03-10T23:30:00.000Z',
        slug: 'my-event',
        origin: 'https://medellinjs.org',
      }),
    ).toBe('https://medellinjs.org/events/my-event')
  })
})

describe('buildIcsUid', () => {
  it('formats as event-${eventId}@medellinjs.org', () => {
    expect(buildIcsUid('42')).toBe('event-42@medellinjs.org')
  })
})

describe('buildIcsContent', () => {
  const input: CalendarEventInput = {
    eventId: '42',
    title: 'MedellínJS Meetup; Edición #10, especial',
    startDate: '2026-03-10T23:30:00.000Z',
    endDate: '2026-03-11T01:30:00.000Z',
    venueName: 'Ruta N',
    venueUrl: 'https://maps.google.com/ruta-n',
    slug: 'medellinjs-meetup',
    origin: 'https://medellinjs.org',
  }
  const now = new Date('2026-01-15T12:00:00.000Z')

  it('uses CRLF line endings throughout (RFC 5545)', () => {
    const ics = buildIcsContent(input, now)
    expect(ics.includes('\r\n')).toBe(true)
    // every logical line must end with \r\n, not a bare \n
    const withoutCrlf = ics.split('\r\n').join('')
    expect(withoutCrlf.includes('\n')).toBe(false)
  })

  it('includes PRODID and METHOD:PUBLISH', () => {
    const ics = buildIcsContent(input, now)
    expect(ics).toContain('PRODID:')
    expect(ics).toContain('METHOD:PUBLISH')
  })

  it('contains exactly one VEVENT block', () => {
    const ics = buildIcsContent(input, now)
    expect(ics.match(/BEGIN:VEVENT/g)?.length).toBe(1)
    expect(ics.match(/END:VEVENT/g)?.length).toBe(1)
  })

  it('formats DTSTART/DTEND in UTC via toCalendarUTC', () => {
    const ics = buildIcsContent(input, now)
    expect(ics).toContain('DTSTART:20260310T233000Z')
    expect(ics).toContain('DTEND:20260311T013000Z')
  })

  it('escapes SUMMARY and LOCATION', () => {
    const ics = buildIcsContent(input, now)
    expect(ics).toContain('SUMMARY:MedellínJS Meetup\\; Edición #10\\, especial')
    expect(ics).toContain('LOCATION:Ruta N (https://maps.google.com/ruta-n)')
  })

  it('contains exactly one VALARM block with ACTION:DISPLAY and TRIGGER:-PT1H', () => {
    const ics = buildIcsContent(input, now)
    expect(ics.match(/BEGIN:VALARM/g)?.length).toBe(1)
    expect(ics).toContain('ACTION:DISPLAY')
    expect(ics).toContain('TRIGGER:-PT1H')
  })

  it('uses the injectable now param for a deterministic DTSTAMP', () => {
    const ics = buildIcsContent(input, now)
    expect(ics).toContain('DTSTAMP:20260115T120000Z')
  })
})

describe('buildIcsFilename', () => {
  it('builds a filename from the event slug', () => {
    expect(
      buildIcsFilename({
        eventId: '42',
        title: 'x',
        startDate: '2026-03-10T23:30:00.000Z',
        slug: 'medellinjs-meetup',
        origin: 'https://medellinjs.org',
      }),
    ).toBe('medellinjs-meetup.ics')
  })

  it('falls back to eventId when slug is missing', () => {
    expect(
      buildIcsFilename({
        eventId: '42',
        title: 'x',
        startDate: '2026-03-10T23:30:00.000Z',
        origin: 'https://medellinjs.org',
      }),
    ).toBe('42.ics')
  })
})
