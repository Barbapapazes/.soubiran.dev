import type { MaybeRefOrGetter } from 'vue'
import { onMounted, ref, toValue } from 'vue'
import { useRoute } from 'vue-router'

export function useLogin(fragment?: MaybeRefOrGetter<string | undefined>) {
  const route = useRoute()

  const githubLink = ref(`${import.meta.env.VITE_API_URL}/auth/github/redirect`)
  const googleLink = ref(`${import.meta.env.VITE_API_URL}/auth/google/redirect`)

  onMounted(() => {
    const redirect = encodeURIComponent(`${window.location.origin}${route.path}${toValue(fragment)
      ? `#${toValue(fragment)}`
      : ''
    }`)

    githubLink.value = `${import.meta.env.VITE_API_URL}/auth/github/redirect?redirect=${
      redirect
    }`
    googleLink.value = `${import.meta.env.VITE_API_URL}/auth/google/redirect?redirect=${
      redirect
    }`
  })

  return {
    githubLink,
    googleLink,
  }
}
