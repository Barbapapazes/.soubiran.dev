import { createSharedComposable } from '@vueuse/core'
import { readonly, ref } from 'vue'

export function _useTableOfContents() {
  const activeHeadings = ref<string[]>([])

  function setActive(id: string) {
    activeHeadings.value.push(id)
  }

  function unsetActive(id: string) {
    activeHeadings.value = activeHeadings.value.filter(h => h !== id)
  }

  return {
    setActive,
    unsetActive,

    activeHeadings: readonly(activeHeadings),
  }
}

export default createSharedComposable(_useTableOfContents)
