import request from '@/utils/request'
// 获取员工简单信息的接口
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

export function getUserList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
// 删除功能
export function delEmploye(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'delete'
  })
}

// 新增员工的api
export function addEmployes(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

// 导入员工的接口
export function importEmployess(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 保存个人基本信息：
export function saveUserByid(data) {
  return request({
    url: '/sys/user/' + data.id,
    method: 'put',
    data
  })
}
// 读取个人信息 保存个人信息 读取岗位信息 保存岗位信息

// 获取员工个人信息
export function getPersonMess(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

// 保存员工个人信息
export function UpdaPersoin(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}history
// 获取用户的岗位信息获取的时候获取他的id
export function getjobs(id) {
  return request({
    url: `/employees/${id}/jobs`

  })
}
// 保存岗位信息 保存的时候要带对象的id
export function updateJobs(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data

  })
}
// 给用户分配角色
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
