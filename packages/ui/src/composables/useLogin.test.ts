import { describe, expect, it } from 'vitest'
import { buildLoginLink } from './useLogin'

describe('buildLoginLink', () => {
  it('removes the current hash and returns through the comments anchor', () => {
    const link = new URL(buildLoginLink(
      'https://api.soubiran.dev',
      'https://soubiran.dev/fr/posts/reusable-comments#old-anchor',
      'comments',
    ))

    expect(link.origin).toBe('https://api.soubiran.dev')
    expect(link.pathname).toBe('/login')
    expect(link.searchParams.get('redirect')).toBe('https://soubiran.dev/fr/posts/reusable-comments')
    expect(link.hash).toBe('#comments')
  })
})
