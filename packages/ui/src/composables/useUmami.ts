export default function useUmami() {
  function track(event: string, data?: Record<string, unknown>) {
    if (typeof window === 'undefined') {
      return
    }

    window.umami?.track(event, {
      ...data,
      page_path: window.location.pathname,
    })
  }

  return {
    track,
  }
}
