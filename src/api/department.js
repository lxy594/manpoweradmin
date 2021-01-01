import request from '@/utils/request'

export const getDepartmentds = function() {
  return request({
    url: '/company/department'
  })
}

export function delDepartmentds(id) {
  return request({
    url: '/company/department/' + id,
    method: 'delete'
  })
}
// 添加部门:
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
// 数据获取的办法回显编辑窗口数据
export function getDepartmentDeta(id) {
  return request({
    url: '/company/department/' + id
  })
}
export function editDepartment(data) {
  return request({
    url: '/company/department/' + data.id,
    method: 'put',
    data
  })
}
