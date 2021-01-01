import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
// 设置时间戳
const timeKey = 'vue_admin_template_time'
// 获取时间戳
export function getTime() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTime() {
  Cookies.set(timeKey, Date.now())
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
