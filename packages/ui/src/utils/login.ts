export const LOGIN_CALLBACK_MESSAGE_TYPE = 'soubiran:login-complete'
export const LOGIN_CALLBACK_NONCE_PARAM = 'login_attempt'

export interface LoginCallbackMessage {
  type: typeof LOGIN_CALLBACK_MESSAGE_TYPE
  nonce: string
}

export function buildLoginCallbackUrl(currentUrl: string, callbackPath: string, nonce: string) {
  const callback = new URL(callbackPath, currentUrl)
  callback.searchParams.set(LOGIN_CALLBACK_NONCE_PARAM, nonce)

  return callback
}

export function isLoginCallbackMessage(data: unknown): data is LoginCallbackMessage {
  if (!data || typeof data !== 'object') {
    return false
  }

  const message = data as Partial<LoginCallbackMessage>
  return message.type === LOGIN_CALLBACK_MESSAGE_TYPE && typeof message.nonce === 'string'
}
