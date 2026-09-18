/**
 * Escapes a single CSV cell value.
 *
 * Order matters: neutralize-then-quote.
 * 1. Check whether the value, TRIMMED of leading whitespace, starts with
 *    `=`, `+`, `-`, or `@` (a formula-injection risk in spreadsheet apps
 *    like Excel/Google Sheets) — spreadsheet apps trim leading whitespace
 *    before evaluating a cell as a formula, so `' =1+1'` is just as
 *    dangerous as `'=1+1'`. If so, prefix the ORIGINAL (untrimmed) value
 *    with `'` at position 0, FIRST, before any quoting decision is made.
 *    Legitimate leading whitespace in the data is preserved, not stripped —
 *    only the `'` neutralization prefix is added ahead of it.
 * 2. ALWAYS wrap the (possibly-prefixed) result in double quotes, doubling
 *    any embedded `"` per RFC 4180.
 *
 * `null`/`undefined` become an empty quoted cell (`""`) — never crash, never
 * emit the literal "null"/"undefined".
 *
 * Known limitation (accepted, not mitigated): Unicode homoglyphs of
 * `=`/`+`/`-`/`@` (e.g. fullwidth or lookalike characters) are NOT detected
 * by this check and could still be used to smuggle a formula-like value
 * past this neutralization.
 */
export function escapeCsvCell(value: string | null | undefined): string {
  const raw = value ?? ''
  const needsFormulaNeutralization = /^[=+\-@]/.test(raw.trimStart())
  const neutralized = needsFormulaNeutralization ? `'${raw}` : raw
  const quoted = neutralized.replace(/"/g, '""')
  return `"${quoted}"`
}

/**
 * One row of attendee data destined for the exported CSV. Field order here
 * defines the column order in the output.
 */
export interface AttendeeCsvRow {
  fullName: string
  email: string
  role: string
  jobPosition: string
}

/**
 * Spanish column headers, in the exact order they appear in the CSV.
 */
export const ATTENDEE_CSV_HEADERS = ['Nombre', 'Email', 'Rol', 'Cargo'] as const

const CSV_LINE_BREAK = '\r\n'

/**
 * Builds the full CSV file content for a list of event attendees.
 *
 * Every cell (headers and data) is run through `escapeCsvCell` for
 * consistent quoting/formula-injection protection. Rows are CRLF-joined per
 * RFC 4180, with a trailing CRLF after the last row (including when `rows`
 * is empty, in which case only the header row is emitted).
 */
export function buildAttendeesCsv(rows: AttendeeCsvRow[]): string {
  const headerLine = ATTENDEE_CSV_HEADERS.map((header) => escapeCsvCell(header)).join(',')

  const dataLines = rows.map((row) =>
    [row.fullName, row.email, row.role, row.jobPosition]
      .map((cell) => escapeCsvCell(cell))
      .join(','),
  )

  return [headerLine, ...dataLines].join(CSV_LINE_BREAK) + CSV_LINE_BREAK
}

/**
 * Builds the download filename for the attendees CSV export:
 * `${eventSlug}-attendees-${YYYY-MM-DD}.csv`.
 *
 * `date` is injectable for deterministic tests; defaults to `new Date()`.
 * Uses UTC date parts (mirrors `calendar.ts`'s UTC-first convention) so the
 * filename doesn't shift depending on the server's local timezone.
 */
export function buildAttendeesCsvFilename(eventSlug: string, date: Date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${eventSlug}-attendees-${year}-${month}-${day}.csv`
}

/**
 * A minimally-shaped populated attendee: enough fields to build a CSV row.
 */
export interface PopulatedAttendee {
  fullName: string
  email: string
  role: string
  jobPosition: string
}

/**
 * Narrows an `event.attendees` array entry down to a valid, populated
 * member-like object.
 *
 * An attendee relation entry can arrive as:
 * - a raw number (unpopulated relation id, e.g. when `depth: 0` was used)
 * - `null`/`undefined` (broken/dangling relation reference)
 * - a partial/malformed object (data integrity issue upstream)
 *
 * Only entries that are populated objects with string `fullName`, `email`,
 * `role`, and `jobPosition` (matching every field declared on
 * `PopulatedAttendee`) are considered valid CSV rows. Callers should
 * log/skip anything that fails this check rather than throwing.
 */
export function isPopulatedAttendee(value: unknown): value is PopulatedAttendee {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.fullName === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.role === 'string' &&
    typeof candidate.jobPosition === 'string'
  )
}

/**
 * Checks whether a user's `role` is present in an allow-list of roles that
 * may access the attendees CSV export.
 *
 * Extracted as a pure, independently-testable predicate because the current
 * `Users` collection only defines `admin`/`organizer` roles — both of which
 * are always in the allow-list — so the "authenticated but disallowed role"
 * branch has no real-world trigger today. Unit-testing this function with a
 * synthetic disallowed role (e.g. `'member'`) proves the gate logic itself
 * is correct, protecting against regressions if a new role is ever added.
 */
export function hasAllowedRole(
  role: string | null | undefined,
  allowedRoles: readonly string[],
): boolean {
  if (!role) return false
  return allowedRoles.includes(role)
}
