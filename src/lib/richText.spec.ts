import { describe, it, expect } from 'vitest'
import { extractPlainText } from './richText'

describe('extractPlainText', () => {
  it('returns an empty string for null input', () => {
    expect(extractPlainText(null)).toBe('')
  })

  it('returns an empty string for undefined input', () => {
    expect(extractPlainText(undefined)).toBe('')
  })

  it('returns an empty string when root/children are missing', () => {
    expect(extractPlainText({})).toBe('')
    expect(extractPlainText({ root: {} })).toBe('')
    expect(extractPlainText({ root: { children: [] } })).toBe('')
  })

  it('extracts text from a single text node', () => {
    const richText = {
      root: {
        children: [{ type: 'text', text: 'Hello world' }],
      },
    }
    expect(extractPlainText(richText)).toBe('Hello world')
  })

  it('extracts and joins text from nested children', () => {
    const richText = {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Hello ' },
              { type: 'text', text: 'world' },
            ],
          },
        ],
      },
    }
    expect(extractPlainText(richText)).toBe('Hello world')
  })

  it('joins multiple top-level paragraph nodes with a space separator', () => {
    const richText = {
      root: {
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'First paragraph.' }] },
          { type: 'paragraph', children: [{ type: 'text', text: 'Second paragraph.' }] },
        ],
      },
    }
    expect(extractPlainText(richText)).toBe('First paragraph. Second paragraph.')
  })

  it('truncates the extracted text at maxLength when provided', () => {
    const richText = {
      root: {
        children: [{ type: 'text', text: 'This is a fairly long sentence to be truncated.' }],
      },
    }
    expect(extractPlainText(richText, 10)).toBe('This is a ')
    expect(extractPlainText(richText, 10).length).toBe(10)
  })

  it('does not truncate when maxLength is not provided', () => {
    const longText = 'a'.repeat(500)
    const richText = { root: { children: [{ type: 'text', text: longText }] } }
    expect(extractPlainText(richText)).toBe(longText)
  })

  it('never throws on malformed input', () => {
    expect(() => extractPlainText('not an object')).not.toThrow()
    expect(() => extractPlainText(42)).not.toThrow()
    expect(() => extractPlainText({ root: { children: 'not-an-array' } })).not.toThrow()
    expect(extractPlainText('not an object')).toBe('')
  })
})
