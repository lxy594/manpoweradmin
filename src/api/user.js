import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data
  })
}
// 获取用户资料的接口
export function getUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'

  })
}
// 获取用户的头像/:读取和保存用户信息的接口
export function getUserheadByid(id) {
  return request({
    url: '/sys/user/' + id
  })
}

export function logout() {

}
