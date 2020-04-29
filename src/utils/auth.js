
const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return window.localStorage.getItem(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}
