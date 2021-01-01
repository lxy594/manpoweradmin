import request from '@/utils/request'

export const getDepartments = function() {
  return request({
    url: '/company/department'
  })
}

export function delDepartments(id) {
  return request({
    url: '/company/department/' + id,
    method: 'delete'
  })
}

export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

export function getDepartmentDetails(id) {
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
