const TOKEN_KEY = "auth-token"

export const setAuthorizationToken = (token: string) => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const getAuthorizationToken = () => {
  return window.localStorage.getItem(TOKEN_KEY) || ""
}
