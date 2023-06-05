import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// =========== role
export function getAllUserRole() {
  return request({
    url: '/user/role',
    method: 'get'
  })
}

export function insertRole(data) {
  return request({
    url: '/user/role/save',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/user/role/delete',
    method: 'delete',
    params: id
  })
}

export function updateRole(data) {
  return request({
    url: '/user/role/update',
    method: 'put',
    data
  })
}
