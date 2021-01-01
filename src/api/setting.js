import request from '@/utils/request'
// 获取所有角色列表
export function getRolelist(params) {
  return request({
    url: '/sys/role/',
    params
  })
}
// 根据id查询公司的信息--------?这个请求接口undefined
export function getcompanyInfo(campanyId) {
  return request({
    url: '/company/' + campanyId
  })
}
// 删除角色功能
export function getcompanyDel(id) {
  return request({
    url: '/sys/role/' + id,
    method: 'delete'
  })
}
// 封装编辑角色的功能api
// 1修改(更新）角色：
export function updateRole(data) {
  return request({
    url: '/sys/role/' + data.id,
    data,
    method: 'put'
  })
}
// 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: '/sys/role/' + id
  })
}
// 新增角色的功能
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data

  })
}
// 分配权限:
export function assignPrem(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
