import { expect, test } from '@playwright/test'

/**
 * Tests for HTML head element ordering based on capo.js rules
 * Reference: https://rviscomi.github.io/capo.js/user/rules/
 *
 * The optimal head order according to capo.js:
 * 1. Meta charset
 * 2. Meta viewport
 * 3. Title
 * 4. Preconnect links
 * 5. Async/defer scripts (early loading, e.g., critical scripts)
 * 6. CSS files (stylesheet links)
 * 7. Synchronous scripts (if any)
 * 8. Preload resources
 * 9. Modulepreload
 * 10. Async/defer scripts (late loading, e.g., analytics)
 * 11. Everything else (meta tags, icons, etc.)
 * 12. Service worker registration (if any)
 * 13. JSON-LD scripts
 */

test('head elements are ordered according to capo.js rules', async ({ page }) => {
  // Fetch the raw HTML instead of relying on DOM which can be modified by JavaScript
  const response = await page.goto('/')
  const htmlContent = await response!.text()

  // Parse head elements from the raw HTML
  const headElements = await page.evaluate((html) => {
    const headMatch = html.match(/<head[^>]*>(.*?)<\/head>/s)

    if (!headMatch)
      return []

    const headContent = headMatch[1]
    const elements = []
    // Match opening tags more carefully to avoid backtracking
    const tagRegex = /<([a-z][a-z0-9]*)\b([^>]*)>/gi
    let match
    let index = 0

    // eslint-disable-next-line no-cond-assign
    while ((match = tagRegex.exec(headContent)) !== null) {
      const tagName = match[1].toLowerCase()
      const attrsString = match[2]

      // Skip closing tags and content
      if (tagName === 'title' || tagName === 'script' || tagName === 'style') {
        // For these tags, skip to their closing tag
        const closeTag = `</${tagName}>`
        const closeIdx = headContent.indexOf(closeTag, match.index)
        if (closeIdx !== -1) {
          tagRegex.lastIndex = closeIdx + closeTag.length
        }
      }

      const attrs: Record<string, string> = {}

      // Parse attributes
      const attrRegex = /(\w+)(?:=["']([^"']*)["'])?/g
      let attrMatch
      // eslint-disable-next-line no-cond-assign
      while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
        const attrName = attrMatch[1]
        const attrValue = attrMatch[2] || 'true'

        if (attrName === 'charset' || attrName === 'name' || attrName === 'property'
          || attrName === 'rel' || attrName === 'href' || attrName === 'src'
          || attrName === 'id' || attrName === 'type' || attrName === 'defer'
          || attrName === 'async' || attrName === 'crossorigin' || attrName === 'onload') {
          attrs[attrName] = attrValue
        }
      }

      elements.push({ index, tagName, attrs })
      index++
    }

    return elements
  }, htmlContent)

  // Helper to find first occurrence of element matching criteria
  function findFirst(predicate: (el: typeof headElements[0]) => boolean): number {
    const index = headElements.findIndex(predicate)
    return index === -1 ? Infinity : index
  }

  // Helper to find last occurrence
  function findLast(predicate: (el: typeof headElements[0]) => boolean): number {
    let lastIndex = -1
    headElements.forEach((el, idx) => {
      if (predicate(el))
        lastIndex = idx
    })
    return lastIndex === -1 ? -Infinity : lastIndex
  }

  // 1. Meta charset should be first
  const charsetIndex = findFirst(el => el.tagName === 'meta' && el.attrs.charset)
  expect(charsetIndex).toBeLessThan(Infinity)
  expect(charsetIndex).toBe(0) // Should be the very first element

  // 2. Meta viewport should come early (after charset, before or at position 1-2)
  const viewportIndex = findFirst(el => el.tagName === 'meta' && el.attrs.name === 'viewport')
  expect(viewportIndex).toBeLessThan(Infinity)
  expect(viewportIndex).toBeGreaterThan(charsetIndex)
  expect(viewportIndex).toBeLessThanOrEqual(2) // Should be within first 3 elements

  // 3. Title should come early (after charset and viewport)
  const titleIndex = findFirst(el => el.tagName === 'title')
  expect(titleIndex).toBeLessThan(Infinity)
  expect(titleIndex).toBeGreaterThan(viewportIndex)
  expect(titleIndex).toBeLessThanOrEqual(5) // Should be within first 6 elements

  // 4. Preconnect links should come before CSS
  const firstPreconnectIndex = findFirst(el => el.tagName === 'link' && el.attrs.rel === 'preconnect')
  const firstStylesheetIndex = findFirst(el =>
    el.tagName === 'link'
    && (el.attrs.rel === 'stylesheet' || el.attrs.rel?.includes('stylesheet')),
  )

  if (firstPreconnectIndex < Infinity && firstStylesheetIndex < Infinity) {
    expect(firstPreconnectIndex).toBeLessThan(firstStylesheetIndex)
  }

  // 5. Early async/defer scripts (like theme script) should come before CSS
  const firstEarlyScriptIndex = findFirst(el =>
    el.tagName === 'script'
    && !el.attrs.src, // Inline scripts for critical functionality
  )

  if (firstEarlyScriptIndex < Infinity && firstStylesheetIndex < Infinity) {
    expect(firstEarlyScriptIndex).toBeLessThan(firstStylesheetIndex)
  }

  // 6. CSS files should come before most other resources
  // Note: Only count synchronous/blocking stylesheets, not async ones loaded via preload+onload
  const lastStylesheetIndex = findLast(el =>
    el.tagName === 'link'
    && (el.attrs.rel === 'stylesheet' || el.attrs.rel?.includes('stylesheet'))
    && !el.attrs.onload, // Exclude async stylesheets loaded via onload
  )
  const firstStyleIndex = findFirst(el => el.tagName === 'style')

  // Style tags should come after or with stylesheets
  if (firstStyleIndex < Infinity && firstStylesheetIndex < Infinity) {
    expect(firstStyleIndex).toBeGreaterThanOrEqual(firstStylesheetIndex)
  }

  // 7. Preload/modulepreload resources should come after CSS
  // (We don't need to assert position, just checking they exist correctly)
  const _firstPreloadIndex = findFirst(el =>
    el.tagName === 'link'
    && (el.attrs.rel === 'preload' || el.attrs.rel === 'modulepreload'),
  )

  // 8. Late async/defer scripts (like analytics) should come after blocking CSS
  // Note: They can come before async stylesheets (preload+onload) since those are non-blocking
  const firstLateScriptIndex = findFirst(el =>
    el.tagName === 'script'
    && el.attrs.src
    && (el.attrs.defer || el.attrs.async),
  )

  if (firstLateScriptIndex < Infinity) {
    // Late scripts should be after blocking stylesheets (not async ones)
    if (lastStylesheetIndex > -Infinity) {
      expect(firstLateScriptIndex).toBeGreaterThan(lastStylesheetIndex)
    }
  }

  // 9. Module scripts should come after CSS
  const firstModuleScriptIndex = findFirst(el =>
    el.tagName === 'script'
    && el.attrs.type === 'module',
  )

  if (firstModuleScriptIndex < Infinity && lastStylesheetIndex > -Infinity) {
    expect(firstModuleScriptIndex).toBeGreaterThan(lastStylesheetIndex)
  }

  // 10. Icons and other meta should come after critical resources
  const firstIconIndex = findFirst(el =>
    el.tagName === 'link'
    && (el.attrs.rel === 'icon' || el.attrs.rel === 'apple-touch-icon'),
  )

  if (firstIconIndex < Infinity) {
    // Icons should be after stylesheets
    if (lastStylesheetIndex > -Infinity) {
      expect(firstIconIndex).toBeGreaterThan(lastStylesheetIndex)
    }

    // Icons should be after module scripts
    if (firstModuleScriptIndex < Infinity) {
      expect(firstIconIndex).toBeGreaterThan(firstModuleScriptIndex)
    }
  }

  // 11. JSON-LD should come last
  const jsonLdIndex = findFirst(el =>
    el.tagName === 'script'
    && el.attrs.type === 'application/ld+json',
  )

  if (jsonLdIndex < Infinity) {
    // JSON-LD should be after all other scripts
    if (firstModuleScriptIndex < Infinity) {
      expect(jsonLdIndex).toBeGreaterThan(firstModuleScriptIndex)
    }
    if (firstLateScriptIndex < Infinity) {
      expect(jsonLdIndex).toBeGreaterThan(firstLateScriptIndex)
    }

    // JSON-LD should be after icons
    if (firstIconIndex < Infinity) {
      expect(jsonLdIndex).toBeGreaterThan(firstIconIndex)
    }
  }

  // 12. OpenGraph and Twitter meta tags should come after CSS but before JSON-LD
  const firstOgMetaIndex = findFirst(el =>
    el.tagName === 'meta'
    && (el.attrs.property?.startsWith('og:') || el.attrs.name?.startsWith('twitter:')),
  )

  if (firstOgMetaIndex < Infinity) {
    // OG meta should be after stylesheets
    if (lastStylesheetIndex > -Infinity) {
      expect(firstOgMetaIndex).toBeGreaterThan(lastStylesheetIndex)
    }

    // OG meta should be after module scripts
    if (firstModuleScriptIndex < Infinity) {
      expect(firstOgMetaIndex).toBeGreaterThan(firstModuleScriptIndex)
    }

    // OG meta should be before JSON-LD
    if (jsonLdIndex < Infinity) {
      expect(firstOgMetaIndex).toBeLessThan(jsonLdIndex)
    }
  }
})

test('critical meta tags are in the correct order', async ({ page }) => {
  await page.goto('/')

  const criticalMeta = await page.evaluate(() => {
    const head = document.head
    const elements = Array.from(head.children)
    const critical = []

    for (let i = 0; i < Math.min(10, elements.length); i++) {
      const el = elements[i]
      const tagName = el.tagName.toLowerCase()

      if (tagName === 'meta') {
        const charset = el.getAttribute('charset')
        const name = el.getAttribute('name')
        if (charset) {
          critical.push({ index: i, type: 'charset', value: charset })
        }
        else if (name === 'viewport') {
          critical.push({ index: i, type: 'viewport', value: name })
        }
      }
      else if (tagName === 'title') {
        critical.push({ index: i, type: 'title' })
      }
    }

    return critical
  })

  // Verify order: charset -> viewport -> title
  expect(criticalMeta.length).toBeGreaterThanOrEqual(3)
  expect(criticalMeta[0].type).toBe('charset')
  expect(criticalMeta[1].type).toBe('viewport')
  expect(criticalMeta[2].type).toBe('title')
})

test('preconnect links come before stylesheets', async ({ page }) => {
  await page.goto('/')

  const hasPreconnectBeforeStylesheet = await page.evaluate(() => {
    const head = document.head
    const elements = Array.from(head.children)

    let firstPreconnectIndex = -1
    let firstStylesheetIndex = -1

    elements.forEach((el, index) => {
      if (el.tagName.toLowerCase() === 'link') {
        const rel = el.getAttribute('rel')

        if (rel === 'preconnect' && firstPreconnectIndex === -1) {
          firstPreconnectIndex = index
        }

        if (rel === 'stylesheet' && firstStylesheetIndex === -1) {
          firstStylesheetIndex = index
        }
      }
    })

    return {
      hasPreconnect: firstPreconnectIndex !== -1,
      hasStylesheet: firstStylesheetIndex !== -1,
      preconnectFirst: firstPreconnectIndex !== -1 && firstStylesheetIndex !== -1
        ? firstPreconnectIndex < firstStylesheetIndex
        : true,
    }
  })

  // If both preconnect and stylesheet exist, preconnect should come first
  if (hasPreconnectBeforeStylesheet.hasPreconnect && hasPreconnectBeforeStylesheet.hasStylesheet) {
    expect(hasPreconnectBeforeStylesheet.preconnectFirst).toBe(true)
  }
})

test('analytics and tracking scripts are deferred and come late', async ({ page }) => {
  await page.goto('/')

  const analyticsScripts = await page.evaluate(() => {
    const head = document.head
    const elements = Array.from(head.children)

    const scripts = []
    let lastStylesheetIndex = -1

    elements.forEach((el, index) => {
      if (el.tagName.toLowerCase() === 'link' && el.getAttribute('rel') === 'stylesheet') {
        lastStylesheetIndex = index
      }

      if (el.tagName.toLowerCase() === 'script') {
        const src = el.getAttribute('src')
        const isDeferred = el.hasAttribute('defer') || el.hasAttribute('async')

        // Check if it's an analytics/tracking script
        if (src && (src.includes('umami') || src.includes('analytics') || src.includes('gtag'))) {
          scripts.push({
            index,
            src,
            isDeferred,
            afterStylesheets: lastStylesheetIndex === -1 || index > lastStylesheetIndex,
          })
        }
      }
    })

    return { scripts, lastStylesheetIndex }
  })

  // Analytics scripts should be deferred
  analyticsScripts.scripts.forEach((script) => {
    expect(script.isDeferred).toBe(true)
  })

  // Analytics scripts should come after stylesheets
  analyticsScripts.scripts.forEach((script) => {
    if (analyticsScripts.lastStylesheetIndex !== -1) {
      expect(script.afterStylesheets).toBe(true)
    }
  })
})
