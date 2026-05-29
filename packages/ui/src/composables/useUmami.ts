import { useRoute } from 'vue-router'

export default function useUmami() {
  const route = useRoute()

  function track(event: string, data?: Record<string, unknown>) {
    try {
      window.umami?.track(event, {
        ...data,
        page_path: route.path,
      })
    }
    catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to track Umami event.', error)
      }
    }
  }

  return {
    track,
  }
}
