
const TokenKey = 'vue_admin_template_token'
const UsernameKey = 'vue_admin_template_username'

export function getToken() {
  return window.localStorage.getItem(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}

export function getUsername() {
  return window.localStorage.getItem(UsernameKey)
  // return Cookies.get(TokenKey)
}

export function setUsername(token) {
  return window.localStorage.setItem(UsernameKey, token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  window.localStorage.removeItem(UsernameKey)
  return window.localStorage.removeItem(TokenKey)
}
