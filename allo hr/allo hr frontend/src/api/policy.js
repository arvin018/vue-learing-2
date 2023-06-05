import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/policy/view/summary',
    method: 'get',
    data
  })
}

export function getDetail(param) {
  return request({
    url: '/policy/view/detail',
    method: 'get',
    params: param
  })
}

export function getAssignableEmployee(param) {
  return request({
    url: '/policy/view/assignable/employee',
    method: 'get',
    params: param
  })
}

export function getEmployeeInPolicy(param) {
  return request({
    url: '/policy/view/listed_employee',
    method: 'get',
    params: param
  })
}

export function deletePolicySingle(param) {
  return request({
    url: '/policy/delete',
    method: 'delete',
    params: param
  })
}

export function getPolicyType() {
  return request({
    url: '/policy/view/policy_type',
    method: 'get'
  })
}

export function assignEmployees(data) {
  return request({
    url: '/policy/assign',
    method: 'post',
    data
  })
}

export function unassignEmployee(param) {
  return request({
    url: '/policy/delete/unassigned_employee',
    method: 'delete',
    params: param
  })
}

export function getPolicySetting(param) {
  return request({
    url: '/policy/view/setting',
    method: 'get',
    params: param
  })
}

export function updatePolSetting(param, data) {
  return request({
    url: '/policy/update/setting',
    method: 'put',
    params: param,
    data
  })
}

export function getRoundingType() {
  return request({
    url: '/policy/view/policy_rounding_type',
    method: 'get'
  })
}

export function savePolicy(data) {
  return request({
    url: '/policy/save',
    method: 'post',
    data
  })
}
