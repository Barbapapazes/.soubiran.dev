import { expect, test } from '@playwright/test'

/**
 * Test for HTML head element ordering based on capo.js rules
 * Reference: https://rviscomi.github.io/capo.js/user/rules/
 *
 * Validates critical head element ordering rules:
 * 1. charset, viewport, title must be first three elements
 * 2. Preconnect links before stylesheets
 * 3. Analytics scripts are deferred and come after blocking CSS
 */

test('head elements are ordered according to capo.js rules', async ({ page }) => {
  // Fetch raw HTML to avoid dynamically injected elements during hydration
  const response = await page.goto('/')
  const htmlContent = await response!.text()

  // Extract head content from raw HTML
  const headMatch = htmlContent.match(/<head[^>]*>(.*?)<\/head>/s)
  expect(headMatch).toBeTruthy()

  const headContent = headMatch![1]

  // Parse elements from raw HTML
  const elements: Array<{ tag: string, attrs: Record<string, string> }> = []
  const tagRegex = /<([a-z][a-z0-9]*)\b([^>]*)>/gi
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = tagRegex.exec(headContent)) !== null) {
    const tag = match[1].toLowerCase()
    const attrsString = match[2]

    // Skip to closing tag for elements with content
    if (tag === 'title' || tag === 'script' || tag === 'style') {
      const closeIdx = headContent.indexOf(`</${tag}>`, match.index)
      if (closeIdx !== -1)
        tagRegex.lastIndex = closeIdx + tag.length + 3
    }

    // Parse attributes
    const attrs: Record<string, string> = {}
    const attrRegex = /(\w+)(?:=["']([^"']*)["'])?/g
    let attrMatch
    // eslint-disable-next-line no-cond-assign
    while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2] || 'true'
    }

    elements.push({ tag, attrs })
  }

  // 1. Critical meta tags must be first three elements
  expect(elements[0].tag).toBe('meta')
  expect(elements[0].attrs.charset).toBeDefined()

  expect(elements[1].tag).toBe('meta')
  expect(elements[1].attrs.name).toBe('viewport')

  expect(elements[2].tag).toBe('title')

  // 2. Preconnect should come before stylesheets
  const preconnectIdx = elements.findIndex(el => el.tag === 'link' && el.attrs.rel === 'preconnect')
  const stylesheetIdx = elements.findIndex(el => el.tag === 'link' && el.attrs.rel === 'stylesheet')

  if (preconnectIdx !== -1 && stylesheetIdx !== -1)
    expect(preconnectIdx).toBeLessThan(stylesheetIdx)

  // 3. Analytics scripts should be deferred and after blocking stylesheets
  const analyticsIdx = elements.findIndex(el =>
    el.tag === 'script' && el.attrs.src?.includes('umami'),
  )

  if (analyticsIdx !== -1) {
    // Verify script is deferred or async
    const hasAsync = elements[analyticsIdx].attrs.defer !== undefined || elements[analyticsIdx].attrs.async !== undefined
    expect(hasAsync).toBe(true)

    const lastBlockingStyleIdx = elements.findLastIndex(el =>
      el.tag === 'link' && el.attrs.rel === 'stylesheet' && !el.attrs.onload,
    )

    if (lastBlockingStyleIdx !== -1)
      expect(analyticsIdx).toBeGreaterThan(lastBlockingStyleIdx)
  }
})
