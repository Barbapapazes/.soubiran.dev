import { computed, onScopeDispose, readonly, ref } from 'vue'

export interface CommentsBanner {
  kind: 'error' | 'success'
  message: string
}

export function useCommentsBanner() {
  const banner = ref<CommentsBanner>()
  let timeout: ReturnType<typeof setTimeout> | undefined

  function dismiss() {
    if (timeout !== undefined) {
      clearTimeout(timeout)
      timeout = undefined
    }

    banner.value = undefined
  }

  function show(nextBanner: CommentsBanner) {
    dismiss()
    banner.value = nextBanner
    timeout = setTimeout(() => {
      banner.value = undefined
      timeout = undefined
    }, 5_000)
  }

  onScopeDispose(dismiss)

  return {
    banner: readonly(banner),
    isActive: computed(() => banner.value !== undefined),
    dismiss,
    show,
  }
}
