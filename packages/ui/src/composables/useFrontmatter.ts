import type { InjectionKey, Ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import { inject, toRef } from 'vue'

export interface Frontmatter {
  id: string
}

export const frontmatterContextInjectionKey: InjectionKey<Ref<Frontmatter>> = Symbol('soubiran-ui.frontmatter-context')

function _useFrontmatter() {
  const frontmatter = toRef(
    inject<Frontmatter>(frontmatterContextInjectionKey),
  )

  if (!frontmatter.value) {
    throw new Error('No frontmatter provided in the current context.')
  }

  return {
    frontmatter,
  }
}

export const useFrontmatter = createSharedComposable(_useFrontmatter)
