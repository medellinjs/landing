import { describe, it, expect } from 'vitest'
import {
  escapeCsvCell,
  buildAttendeesCsv,
  buildAttendeesCsvFilename,
  isPopulatedAttendee,
  hasAllowedRole,
  type AttendeeCsvRow,
} from './csv'

describe('escapeCsvCell', () => {
  it('neutralizes a formula-injection prefix BEFORE quote-wrapping when the value also contains a comma', () => {
    // Ordering is already proven by the plain `'=cmd|calc'` case below (the
    // `'` prefix always lands ahead of the quoted content). What this case
    // additionally proves is that a neutralized value round-trips correctly
    // through RFC 4180 quoting even when it independently ALSO needs
    // wrapping because it contains a comma.
    expect(escapeCsvCell('=SUM(A1,A2)')).toBe('"\'=SUM(A1,A2)"')
  })

  it('prefixes a value starting with "=" to neutralize formula injection', () => {
    expect(escapeCsvCell('=cmd|calc')).toBe('"\'=cmd|calc"')
  })

  it('prefixes a value starting with "+" to neutralize formula injection', () => {
    expect(escapeCsvCell('+cmd|calc')).toBe('"\'+cmd|calc"')
  })

  it('prefixes a value starting with "-" to neutralize formula injection', () => {
    expect(escapeCsvCell('-cmd|calc')).toBe('"\'-cmd|calc"')
  })

  it('prefixes a value starting with "@" to neutralize formula injection', () => {
    expect(escapeCsvCell('@cmd|calc')).toBe('"\'@cmd|calc"')
  })

  it('doubles embedded double quotes', () => {
    expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""')
  })

  it('returns an empty quoted-string cell for null', () => {
    expect(escapeCsvCell(null)).toBe('""')
  })

  it('returns an empty quoted-string cell for undefined', () => {
    expect(escapeCsvCell(undefined)).toBe('""')
  })

  it('neutralizes a leading-hyphen numeric-looking value', () => {
    expect(escapeCsvCell('-5')).toBe('"\'-5"')
  })

  it('always wraps plain values in quotes, even without special characters', () => {
    expect(escapeCsvCell('Juan Perez')).toBe('"Juan Perez"')
  })

  it('neutralizes a formula-injection prefix hidden behind leading whitespace, without stripping the whitespace', () => {
    // Spreadsheet apps trim leading whitespace before evaluating a cell as a
    // formula, so `' =1+1'` is just as dangerous as `'=1+1'`. The `'` prefix
    // must be applied at position 0 of the ORIGINAL (untrimmed) string.
    expect(escapeCsvCell('  =1+1')).toBe('"\'  =1+1"')
  })

  it('does NOT neutralize a plain value that merely starts with whitespace (no false positive)', () => {
    expect(escapeCsvCell('  hello')).toBe('"  hello"')
  })
})

describe('buildAttendeesCsv', () => {
  it('emits the exact always-quoted Spanish header row', () => {
    const csv = buildAttendeesCsv([])
    const [headerLine] = csv.split('\r\n')
    expect(headerLine).toBe('"Nombre","Email","Rol","Cargo"')
  })

  it('returns header row only (with trailing CRLF) when the input array is empty', () => {
    const csv = buildAttendeesCsv([])
    expect(csv).toBe('"Nombre","Email","Rol","Cargo"\r\n')
  })

  it('CRLF-joins the header and data rows with a trailing CRLF after the last row', () => {
    const rows: AttendeeCsvRow[] = [
      { fullName: 'Ana Gomez', email: 'ana@example.com', role: 'MEMBER', jobPosition: 'Dev' },
      { fullName: 'Luis Ruiz', email: 'luis@example.com', role: 'ORGANIZER', jobPosition: 'PM' },
    ]
    const csv = buildAttendeesCsv(rows)
    expect(csv).toBe(
      '"Nombre","Email","Rol","Cargo"\r\n' +
        '"Ana Gomez","ana@example.com","MEMBER","Dev"\r\n' +
        '"Luis Ruiz","luis@example.com","ORGANIZER","PM"\r\n',
    )
  })

  it('orders data row columns as fullName, email, role, jobPosition', () => {
    const rows: AttendeeCsvRow[] = [
      { fullName: 'Zoe Kim', email: 'zoe@example.com', role: 'SPEAKER', jobPosition: 'CTO' },
    ]
    const csv = buildAttendeesCsv(rows)
    const dataLine = csv.split('\r\n')[1]
    expect(dataLine).toBe('"Zoe Kim","zoe@example.com","SPEAKER","CTO"')
  })
})

describe('buildAttendeesCsvFilename', () => {
  it('builds "{slug}-attendees-{YYYY-MM-DD}.csv" from an injected Date', () => {
    expect(buildAttendeesCsvFilename('my-event', new Date('2026-09-18T12:00:00Z'))).toBe(
      'my-event-attendees-2026-09-18.csv',
    )
  })

  it('zero-pads single-digit month and day', () => {
    expect(buildAttendeesCsvFilename('kickoff', new Date('2026-01-03T00:00:00Z'))).toBe(
      'kickoff-attendees-2026-01-03.csv',
    )
  })
})

describe('isPopulatedAttendee', () => {
  it('returns true for a valid populated member-like object', () => {
    expect(
      isPopulatedAttendee({
        id: 1,
        fullName: 'Ana Gomez',
        email: 'ana@example.com',
        role: 'MEMBER',
        jobPosition: 'Dev',
      }),
    ).toBe(true)
  })

  it('returns false for a raw number (unpopulated relation id, e.g. depth: 0)', () => {
    expect(isPopulatedAttendee(42)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isPopulatedAttendee(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isPopulatedAttendee(undefined)).toBe(false)
  })

  it('returns false for an object missing fullName (broken/partial relation data)', () => {
    expect(isPopulatedAttendee({ id: 1, email: 'ana@example.com' })).toBe(false)
  })

  it('returns false for an object missing email', () => {
    expect(isPopulatedAttendee({ id: 1, fullName: 'Ana Gomez' })).toBe(false)
  })

  it('returns false for an object with a non-string fullName (malformed data)', () => {
    expect(isPopulatedAttendee({ id: 1, fullName: 42, email: 'ana@example.com' })).toBe(false)
  })

  it('returns false for an object missing role, even with valid fullName/email', () => {
    expect(
      isPopulatedAttendee({
        id: 1,
        fullName: 'Ana Gomez',
        email: 'ana@example.com',
        jobPosition: 'Dev',
      }),
    ).toBe(false)
  })

  it('returns false for an object with a non-string role', () => {
    expect(
      isPopulatedAttendee({
        id: 1,
        fullName: 'Ana Gomez',
        email: 'ana@example.com',
        role: 42,
        jobPosition: 'Dev',
      }),
    ).toBe(false)
  })

  it('returns false for an object missing jobPosition, even with valid fullName/email/role', () => {
    expect(
      isPopulatedAttendee({
        id: 1,
        fullName: 'Ana Gomez',
        email: 'ana@example.com',
        role: 'MEMBER',
      }),
    ).toBe(false)
  })

  it('returns false for an object with a non-string jobPosition', () => {
    expect(
      isPopulatedAttendee({
        id: 1,
        fullName: 'Ana Gomez',
        email: 'ana@example.com',
        role: 'MEMBER',
        jobPosition: 42,
      }),
    ).toBe(false)
  })
})

describe('hasAllowedRole', () => {
  it('returns true for "admin"', () => {
    expect(hasAllowedRole('admin', ['admin', 'organizer'])).toBe(true)
  })

  it('returns true for "organizer"', () => {
    expect(hasAllowedRole('organizer', ['admin', 'organizer'])).toBe(true)
  })

  it('returns false for a role not in the allow-list (e.g. a future "member" role)', () => {
    expect(hasAllowedRole('member', ['admin', 'organizer'])).toBe(false)
  })

  it('returns false for an empty/undefined role', () => {
    expect(hasAllowedRole(undefined, ['admin', 'organizer'])).toBe(false)
  })
})
