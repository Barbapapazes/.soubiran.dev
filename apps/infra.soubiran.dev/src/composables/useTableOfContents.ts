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

export const useTableOfContents = createSharedComposable(_useTableOfContents)
