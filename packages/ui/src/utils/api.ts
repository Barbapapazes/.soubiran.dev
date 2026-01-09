import { ofetch } from 'ofetch'

export const api = ofetch.create({
  // TODO: add environment variable to DTS and add it to app tsconfig file
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
  credentials: 'include',
  onRequest: [
    // Set the correct language in the request headers
    async ({ options }) => {
      const pathname = window.location.pathname

      if (pathname.startsWith('/fr')) {
        options.headers.set('Accept-Language', 'fr')
      }
    },
    // Add XSRF-TOKEN cookie to the request headers
    async ({ options }) => {
      const method = options.method?.toUpperCase() || 'GET'

      if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
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
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}
