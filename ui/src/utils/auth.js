// import Cookies from 'js-cookie'

const TokenKey = 'token'
// const visitorJumpKey = 'visitorJumpData'

export function getToken() {
  return getStorge(TokenKey)
}

export function setToken(token) {
  setStorge(TokenKey, token)
}

export function removeToken() {
  removeStorge(TokenKey)
}

export function getStorge(key) {
  return localStorage.getItem(key)
}

export function setStorge(key, value) {
  if (Object.prototype.toString.call(value) === '[object Object]') {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value)
  }
  // Cookies.set(key, value)
}

export function removeStorge(key) {
  localStorage.removeItem(key)
  // Cookies.remove(key)
}