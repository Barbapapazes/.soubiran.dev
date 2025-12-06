import { expect, test } from '@playwright/test'

/**
 * Test for HTML head element ordering based on capo.js rules
 * Reference: https://rviscomi.github.io/capo.js/user/rules/
 *
 * Validates the optimal head order according to capo.js:
 * 1. Meta charset → 2. Meta viewport → 3. Title
 * 4. Preconnect links → 5. Early scripts (inline/critical)
 * 6. CSS files → 7. Preload/modulepreload
 * 8. Late async/defer scripts (analytics) → 9. Icons/meta tags
 * 10. JSON-LD scripts
 */

test('head elements are ordered according to capo.js rules', async ({ page }) => {
  // Fetch raw HTML to avoid dynamically injected elements
  const response = await page.goto('/')
  const htmlContent = await response!.text()

  // Parse head elements from raw HTML
  const headElements = await page.evaluate((html) => {
    const headMatch = html.match(/<head[^>]*>(.*?)<\/head>/s)
    if (!headMatch)
      return []

    const headContent = headMatch[1]
    const elements = []
    const tagRegex = /<([a-z][a-z0-9]*)\b([^>]*)>/gi
    let match
    let index = 0

    // eslint-disable-next-line no-cond-assign
    while ((match = tagRegex.exec(headContent)) !== null) {
      const tagName = match[1].toLowerCase()
      const attrsString = match[2]

      // Skip to closing tag for elements with content
      if (tagName === 'title' || tagName === 'script' || tagName === 'style') {
        const closeTag = `</${tagName}>`
        const closeIdx = headContent.indexOf(closeTag, match.index)
        if (closeIdx !== -1)
          tagRegex.lastIndex = closeIdx + closeTag.length
      }

      // Parse relevant attributes
      const attrs: Record<string, string> = {}
      const attrRegex = /(\w+)(?:=["']([^"']*)["'])?/g
      let attrMatch
      // eslint-disable-next-line no-cond-assign
      while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
        const attrName = attrMatch[1]
        const attrValue = attrMatch[2] || 'true'
        if (['charset', 'name', 'property', 'rel', 'href', 'src', 'type', 'defer', 'async', 'onload'].includes(attrName))
          attrs[attrName] = attrValue
      }

      elements.push({ index, tagName, attrs })
      index++
    }

    return elements
  }, htmlContent)

  function findFirst(predicate: (el: typeof headElements[0]) => boolean): number | null {
    const idx = headElements.findIndex(predicate)
    return idx === -1 ? null : idx
  }

  function findLast(predicate: (el: typeof headElements[0]) => boolean): number | null {
    let lastIdx = -1
    headElements.forEach((el, idx) => {
      if (predicate(el))
        lastIdx = idx
    })
    return lastIdx === -1 ? null : lastIdx
  }

  // 1. Critical meta tags: charset → viewport → title
  const charsetIndex = findFirst(el => el.tagName === 'meta' && el.attrs.charset)
  const viewportIndex = findFirst(el => el.tagName === 'meta' && el.attrs.name === 'viewport')
  const titleIndex = findFirst(el => el.tagName === 'title')

  expect(charsetIndex).toBe(0)
  expect(viewportIndex).toBe(1)
  expect(titleIndex).toBe(2)

  // 2. Preconnect links before stylesheets
  const firstPreconnectIndex = findFirst(el => el.tagName === 'link' && el.attrs.rel === 'preconnect')
  const firstStylesheetIndex = findFirst(el =>
    el.tagName === 'link' && (el.attrs.rel === 'stylesheet' || el.attrs.rel?.includes('stylesheet')),
  )

  if (firstPreconnectIndex !== null && firstStylesheetIndex !== null)
    expect(firstPreconnectIndex).toBeLessThan(firstStylesheetIndex)

  // 3. Early inline scripts before CSS
  const firstEarlyScriptIndex = findFirst(el => el.tagName === 'script' && !el.attrs.src)

  if (firstEarlyScriptIndex !== null && firstStylesheetIndex !== null)
    expect(firstEarlyScriptIndex).toBeLessThan(firstStylesheetIndex)

  // 4. Blocking stylesheets properly grouped
  const lastStylesheetIndex = findLast(el =>
    el.tagName === 'link' && (el.attrs.rel === 'stylesheet' || el.attrs.rel?.includes('stylesheet')) && !el.attrs.onload,
  )
  const firstStyleIndex = findFirst(el => el.tagName === 'style')

  if (firstStyleIndex !== null && firstStylesheetIndex !== null)
    expect(firstStyleIndex).toBeGreaterThanOrEqual(firstStylesheetIndex)

  // 5. Late async/defer scripts after blocking CSS
  const firstLateScriptIndex = findFirst(el =>
    el.tagName === 'script' && el.attrs.src && (el.attrs.defer || el.attrs.async),
  )

  if (firstLateScriptIndex !== null && lastStylesheetIndex !== null)
    expect(firstLateScriptIndex).toBeGreaterThan(lastStylesheetIndex)

  // 6. Analytics scripts are deferred and positioned late
  const analyticsScriptIndex = findFirst(el =>
    el.tagName === 'script'
    && el.attrs.src
    && (el.attrs.src.includes('umami') || el.attrs.src.includes('analytics') || el.attrs.src.includes('gtag')),
  )

  if (analyticsScriptIndex !== null) {
    const analyticsScript = headElements[analyticsScriptIndex]
    expect(analyticsScript.attrs.defer || analyticsScript.attrs.async).toBeTruthy()
    if (lastStylesheetIndex !== null)
      expect(analyticsScriptIndex).toBeGreaterThan(lastStylesheetIndex)
  }

  // 7. Module scripts after CSS
  const firstModuleScriptIndex = findFirst(el => el.tagName === 'script' && el.attrs.type === 'module')

  if (firstModuleScriptIndex !== null && lastStylesheetIndex !== null)
    expect(firstModuleScriptIndex).toBeGreaterThan(lastStylesheetIndex)

  // 8. Icons after critical resources
  const firstIconIndex = findFirst(el =>
    el.tagName === 'link' && (el.attrs.rel === 'icon' || el.attrs.rel === 'apple-touch-icon'),
  )

  if (firstIconIndex !== null) {
    if (lastStylesheetIndex !== null)
      expect(firstIconIndex).toBeGreaterThan(lastStylesheetIndex)
    if (firstModuleScriptIndex !== null)
      expect(firstIconIndex).toBeGreaterThan(firstModuleScriptIndex)
  }

  // 9. JSON-LD last
  const jsonLdIndex = findFirst(el => el.tagName === 'script' && el.attrs.type === 'application/ld+json')

  if (jsonLdIndex !== null) {
    if (firstModuleScriptIndex !== null)
      expect(jsonLdIndex).toBeGreaterThan(firstModuleScriptIndex)
    if (firstLateScriptIndex !== null)
      expect(jsonLdIndex).toBeGreaterThan(firstLateScriptIndex)
    if (firstIconIndex !== null)
      expect(jsonLdIndex).toBeGreaterThan(firstIconIndex)
  }

  // 10. OG/Twitter meta after CSS, before JSON-LD
  const firstOgMetaIndex = findFirst(el =>
    el.tagName === 'meta' && (el.attrs.property?.startsWith('og:') || el.attrs.name?.startsWith('twitter:')),
  )

  if (firstOgMetaIndex !== null) {
    if (lastStylesheetIndex !== null)
      expect(firstOgMetaIndex).toBeGreaterThan(lastStylesheetIndex)
    if (firstModuleScriptIndex !== null)
      expect(firstOgMetaIndex).toBeGreaterThan(firstModuleScriptIndex)
    if (jsonLdIndex !== null)
      expect(firstOgMetaIndex).toBeLessThan(jsonLdIndex)
  }
})
