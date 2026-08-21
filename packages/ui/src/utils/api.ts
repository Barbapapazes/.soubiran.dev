import { FetchError, ofetch } from 'ofetch'

export const api = ofetch.create({
  // TODO: add environment variable to DTS and add it to app tsconfig file
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
  credentials: 'include',
  onRequest: [
    // Add XSRF-TOKEN cookie to the request headers
    async ({ options }) => {
      const method = options.method?.toUpperCase() || 'GET'

      if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        return
      }

      if (typeof document === 'undefined') {
        return
      }

      const xsrfToken = getCookie('XSRF-TOKEN')

      if (!xsrfToken) {
        await ofetch('/sanctum/csrf-cookie', {
          baseURL: import.meta.env.VITE_API_URL,
          credentials: 'include',
        })
      }

      options.headers.set('X-Xsrf-Token', decodeURIComponent(getCookie('XSRF-TOKEN') || ''))
    },
  ],
})

function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return null
  }

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

interface LaravelUnprocessableEntityError extends Error {
  data: {
    message: string
  }
}

export function isUnprocessableEntityError(error: Error): error is LaravelUnprocessableEntityError {
  return error instanceof FetchError && error.response?.status === 422
}
