import { describe, it, expect } from 'vitest'
import {
  DEFAULT_EVENT_DURATION_MS,
  getEventEnd,
  toCalendarUTC,
  formatEventDateOnly,
  formatEventTimeRange,
  formatEventDateTime,
} from './dates'

describe('getEventEnd', () => {
  it('returns the parsed endDate when it is present, valid, and after startDate', () => {
    const event = { startDate: '2026-03-10T18:00:00.000Z', endDate: '2026-03-10T20:00:00.000Z' }
    const result = getEventEnd(event)
    expect(result.toISOString()).toBe('2026-03-10T20:00:00.000Z')
  })

  it('falls back to startDate + 2h when endDate is missing', () => {
    const event = { startDate: '2026-03-10T18:00:00.000Z', endDate: undefined }
    const result = getEventEnd(event)
    expect(result.getTime()).toBe(
      new Date('2026-03-10T18:00:00.000Z').getTime() + DEFAULT_EVENT_DURATION_MS,
    )
  })

  it('falls back to startDate + 2h when endDate is null', () => {
    const event = { startDate: '2026-03-10T18:00:00.000Z', endDate: null }
    const result = getEventEnd(event)
    expect(result.getTime()).toBe(
      new Date('2026-03-10T18:00:00.000Z').getTime() + DEFAULT_EVENT_DURATION_MS,
    )
  })

  it('falls back to startDate + 2h when endDate is unparseable', () => {
    const event = { startDate: '2026-03-10T18:00:00.000Z', endDate: 'not-a-date' }
    const result = getEventEnd(event)
    expect(result.getTime()).toBe(
      new Date('2026-03-10T18:00:00.000Z').getTime() + DEFAULT_EVENT_DURATION_MS,
    )
  })

  it('falls back to startDate + 2h when endDate equals startDate', () => {
    const event = { startDate: '2026-03-10T18:00:00.000Z', endDate: '2026-03-10T18:00:00.000Z' }
    const result = getEventEnd(event)
    expect(result.getTime()).toBe(
      new Date('2026-03-10T18:00:00.000Z').getTime() + DEFAULT_EVENT_DURATION_MS,
    )
  })

  it('falls back to startDate + 2h when endDate is before startDate', () => {
    const event = { startDate: '2026-03-10T18:00:00.000Z', endDate: '2026-03-10T10:00:00.000Z' }
    const result = getEventEnd(event)
    expect(result.getTime()).toBe(
      new Date('2026-03-10T18:00:00.000Z').getTime() + DEFAULT_EVENT_DURATION_MS,
    )
  })
})

describe('toCalendarUTC', () => {
  it('formats a Date instance as YYYYMMDDTHHMMSSZ', () => {
    const date = new Date('2026-03-10T18:30:05.000Z')
    expect(toCalendarUTC(date)).toBe('20260310T183005Z')
  })

  it('formats a date string as YYYYMMDDTHHMMSSZ', () => {
    expect(toCalendarUTC('2026-01-02T03:04:05.000Z')).toBe('20260102T030405Z')
  })
})

// Characterization tests pinning the CURRENT output of the formatters
// previously inlined in EventDetail.tsx (formatDateOnly/formatTimeRange) and
// EventCard.tsx (formatDate), before extraction to this module. Fixed sample:
// 2026-03-10T23:30:00.000Z start / 2026-03-11T01:30:00.000Z end,
// locale 'es-CO', timezone 'America/Bogota'.
describe('formatEventDateOnly', () => {
  it('matches the pre-extraction EventDetail formatDateOnly output', () => {
    expect(formatEventDateOnly('2026-03-10T23:30:00.000Z')).toBe('martes, 10 de marzo de 2026')
  })

  it('accepts an explicit timezone override', () => {
    expect(formatEventDateOnly('2026-03-10T23:30:00.000Z', 'America/Bogota')).toBe(
      'martes, 10 de marzo de 2026',
    )
  })
})

describe('formatEventTimeRange', () => {
  it('matches the pre-extraction EventDetail formatTimeRange output (with endDate)', () => {
    expect(formatEventTimeRange('2026-03-10T23:30:00.000Z', '2026-03-11T01:30:00.000Z')).toBe(
      '6:30 p. m. - 8:30 p. m.',
    )
  })

  it('returns only the start time when endDate is not provided', () => {
    expect(formatEventTimeRange('2026-03-10T23:30:00.000Z', undefined)).toBe('6:30 p. m.')
  })

  it('returns only the start time when endDate is null', () => {
    expect(formatEventTimeRange('2026-03-10T23:30:00.000Z', null)).toBe('6:30 p. m.')
  })
})

describe('formatEventDateTime', () => {
  it('matches the pre-extraction EventCard formatDate output (single Intl call, dateStyle+timeStyle)', () => {
    expect(formatEventDateTime('2026-03-10T23:30:00.000Z')).toBe(
      'martes, 10 de marzo de 2026, 6:30 p. m.',
    )
  })
})
