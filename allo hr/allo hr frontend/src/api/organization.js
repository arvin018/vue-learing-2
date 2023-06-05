import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/organization',
    method: 'get',
    params
  })
}

export function getByLayer(data) {
  return request({
    url: '/organization/search',
    method: 'post',
    data
  })
}

export function getSingle(data) {
  return request({
    url: '/organization/view',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/organization/save',
    method: 'post',
    data
  })
}

export function deleteSingle(data) {
  return request({
    url: '/organization/delete',
    method: 'post',
    data
  })
}

export function getSearch(params) {
  return request({
    url: '/organization/view/search',
    method: 'get',
    params
  })
}

export function getFilterLayer(params) {
  return request({
    url: '/organization/filter/layer',
    method: 'get',
    params
  })
}

export function getFilterParent(params) {
  return request({
    url: '/organization/filter/parent',
    method: 'get',
    params
  })
}

export function getAllName() {
  return request({
    url: '/organization/name',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: 'organization/chart',
    method: 'get'
  })
}

export function updateOrg(data) {
  return request({
    url: '/organization/update',
    method: 'post',
    data
  })
}

export function restoreDeletedData(params) {
  return request({
    url: 'organization/restore',
    method: 'get',
    params: params
  })
}
