import type { MaybeRefOrGetter } from 'vue'
import { useQueryCache } from '@pinia/colada'
import { computed, onBeforeUnmount, ref, toValue } from 'vue'
import { USER_QUERY_KEYS } from '../keys/user'
import {
  buildLoginCallbackUrl,
  isLoginCallbackMessage,
  LOGIN_CALLBACK_MESSAGE_TYPE,
} from '../utils/login'

export type LoginError = 'popup-blocked' | 'popup-closed' | 'refresh-failed'

const LOGIN_ERROR_MESSAGE_KEYS = {
  'popup-blocked': 'LoginRequired.errors.popupBlocked',
  'popup-closed': 'LoginRequired.errors.popupClosed',
  'refresh-failed': 'LoginRequired.errors.refreshFailed',
} as const

export interface UseLoginOptions {
  callbackPath?: MaybeRefOrGetter<string>
}

const DEFAULT_CALLBACK_PATH = '/auth/callback'
const POPUP_WIDTH = 800
const POPUP_HEIGHT = 600
const LOGIN_POPUP_NAME = 'soubiran-login'

export function getLoginErrorMessageKey(error: LoginError) {
  return LOGIN_ERROR_MESSAGE_KEYS[error]
}

export function buildLoginLink(apiUrl: string, currentUrl: string, fragment?: string) {
  const redirect = new URL(currentUrl)
  redirect.hash = ''

  const login = new URL('/login', apiUrl)
  login.searchParams.set('redirect', redirect.toString())
  login.hash = fragment ?? ''

  return login.toString()
}

function createNonce() {
  return crypto.randomUUID()
}

function getPopupFeatures() {
  const left = Math.max(0, window.screenX + (window.outerWidth - POPUP_WIDTH) / 2)
  const top = Math.max(0, window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2)

  return [
    'popup=yes',
    `width=${POPUP_WIDTH}`,
    `height=${POPUP_HEIGHT}`,
    `left=${Math.round(left)}`,
    `top=${Math.round(top)}`,
  ].join(',')
}

export function useLogin(options: UseLoginOptions = {}) {
  const queryCache = useQueryCache()
  const error = ref<LoginError>()
  const isPending = ref(false)

  let popup: Window | null = null
  let closeTimer: ReturnType<typeof setInterval> | undefined
  let removeMessageListener: (() => void) | undefined
  let resolveAttempt: ((success: boolean) => void) | undefined
  let activeAttempt: Promise<boolean> | undefined

  function stopMonitoring() {
    if (closeTimer) {
      clearInterval(closeTimer)
      closeTimer = undefined
    }

    removeMessageListener?.()
    removeMessageListener = undefined
    popup = null
  }

  function cleanup(success: boolean) {
    stopMonitoring()
    isPending.value = false

    resolveAttempt?.(success)
    resolveAttempt = undefined
    activeAttempt = undefined
  }

  function openLoginWindow() {
    if (typeof window === 'undefined') {
      return Promise.resolve(false)
    }

    if (popup && !popup.closed && activeAttempt) {
      popup.focus()
      return activeAttempt
    }

    error.value = undefined
    isPending.value = true

    const nonce = createNonce()
    const callback = buildLoginCallbackUrl(
      window.location.href,
      toValue(options.callbackPath) ?? DEFAULT_CALLBACK_PATH,
      nonce,
    )
    const loginUrl = buildLoginLink(
      import.meta.env.VITE_API_URL,
      callback.toString(),
    )

    activeAttempt = new Promise<boolean>((resolve) => {
      resolveAttempt = resolve
    })

    const onMessage = async (event: MessageEvent) => {
      if (
        event.origin !== callback.origin
        || event.source !== popup
        || !isLoginCallbackMessage(event.data)
        || event.data.type !== LOGIN_CALLBACK_MESSAGE_TYPE
        || event.data.nonce !== nonce
      ) {
        return
      }

      stopMonitoring()

      try {
        await queryCache.invalidateQueries({
          key: USER_QUERY_KEYS.current,
          exact: true,
        })
        cleanup(true)
      }
      catch {
        error.value = 'refresh-failed'
        cleanup(false)
      }
    }

    window.addEventListener('message', onMessage)
    removeMessageListener = () => window.removeEventListener('message', onMessage)

    popup = window.open(
      loginUrl,
      LOGIN_POPUP_NAME,
      getPopupFeatures(),
    )

    if (!popup) {
      error.value = 'popup-blocked'
      cleanup(false)
      return Promise.resolve(false)
    }

    popup.focus()
    closeTimer = setInterval(() => {
      if (popup?.closed) {
        error.value = 'popup-closed'
        cleanup(false)
      }
    }, 500)

    return activeAttempt
  }

  onBeforeUnmount(() => cleanup(false))

  return {
    error: computed(() => error.value),
    isPending: computed(() => isPending.value),
    openLoginWindow,
  }
}
