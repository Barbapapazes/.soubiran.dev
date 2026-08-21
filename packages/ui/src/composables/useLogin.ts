import type { MaybeRefOrGetter } from 'vue'
import { onMounted, ref, toValue } from 'vue'

export function buildLoginLink(apiUrl: string, currentUrl: string, fragment?: string) {
  const redirect = new URL(currentUrl)
  redirect.hash = ''

  const login = new URL('/login', apiUrl)
  login.searchParams.set('redirect', redirect.toString())
  login.hash = fragment ?? ''

  return login.toString()
}

export function useLogin(fragment?: MaybeRefOrGetter<string | undefined>) {
  const loginLink = ref(`${import.meta.env.VITE_API_URL}/login`)

  function updateLoginLink() {
    if (typeof window === 'undefined') {
      return
    }

    loginLink.value = buildLoginLink(
      import.meta.env.VITE_API_URL,
      window.location.href,
      toValue(fragment),
    )
  }

  function navigateToLogin() {
    if (typeof window !== 'undefined') {
      window.location.assign(loginLink.value)
    }
  }

  onMounted(updateLoginLink)

  return {
    loginLink,
    navigateToLogin,
  }
}
