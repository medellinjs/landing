/**
 * Pure, standalone utilities for extracting plain text from Lexical rich
 * text content (as used by Payload CMS's `richText` fields).
 *
 * Deliberately has no dependency on Payload or Lexical types — it walks
 * arbitrary `unknown` input defensively and never throws, since rich text
 * content coming from the CMS can be `null`, `undefined`, or malformed.
 */

function extractNodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''

  const obj = node as Record<string, unknown>
  if (obj.type === 'text') return typeof obj.text === 'string' ? obj.text : ''

  const children = obj.children
  if (Array.isArray(children)) return children.map(extractNodeText).join('')

  return ''
}

/**
 * Walks a Lexical `richText` value (`{ root: { children: [...] } }`) and
 * returns its plain-text content, with top-level nodes joined by a single
 * space. Returns `''` for missing, malformed, or empty input — never throws.
 *
 * When `maxLength` is provided, the result is truncated to that length.
 */
export function extractPlainText(richText: unknown, maxLength?: number): string {
  if (!richText || typeof richText !== 'object') return ''

  const root = (richText as Record<string, unknown>).root
  if (!root || typeof root !== 'object') return ''

  const children = (root as Record<string, unknown>).children
  if (!Array.isArray(children)) return ''

  const fullText = children.map(extractNodeText).join(' ')

  return typeof maxLength === 'number' ? fullText.slice(0, maxLength) : fullText
}
