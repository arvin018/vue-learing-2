import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/employee',
    method: 'get',
    params
  })
}

export function getSingle(data) {
  return request({
    url: '/employee/view',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/employee/save',
    method: 'post',
    data
  })
}

export function updateEmpl(data) {
  return request({
    url: '/employee/update',
    method: 'put',
    data
  })
}

export function deleteSingle(data) {
  return request({
    url: '/employee/delete',
    method: 'post',
    data
  })
}

export function getEmploymentStatus() {
  return request({
    url: '/employee/view/employment_status',
    method: 'get'
  })
}

export function getEmplGrade() {
  return request({
    url: '/employee/view/grade',
    method: 'get'
  })
}

export function getSearch(params) {
  return request({
    url: '/employee/view/search',
    method: 'get',
    params
  })
}

export function filterByStatus(params) {
  return request({
    url: '/employee/filter/status',
    method: 'get',
    params
  })
}

export function filterByOrg(params) {
  return request({
    url: '/employee/filter/org',
    method: 'get',
    params
  })
}

export function filterByGrade(params) {
  return request({
    url: '/employee/filter/grade',
    method: 'get',
    params
  })
}

export function getEmployeeFilterList() {
  return request({
    url: '/employee/view/employee_filter',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/employee/update',
    method: 'put',
    data
  })
}

export function transferEmployee(data) {
  return request({
    url: '/employee/transfer/save',
    method: 'post',
    data
  })
}

export function saveBulk(data) {
  return request({
    url: '/employee/save/bulk',
    method: 'post',
    data
  })
}

export function releasePositionEmployee(param) {
  return request({
    url: '/employee/transfer/release_position',
    method: 'get',
    params: param
  })
}
