import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/position',
    method: 'get',
    params
  })
}

export function getByLevel(data) {
  return request({
    url: '/position/search',
    method: 'post',
    data
  })
}

export function getSingle(data) {
  return request({
    url: '/position/view',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/position/save',
    method: 'post',
    data
  })
}

export function deleteSingle(data) {
  return request({
    url: '/position/delete',
    method: 'post',
    data
  })
}

export function getSearch(params) {
  return request({
    url: '/position/view/search',
    method: 'get',
    params
  })
}

export function getFilterLevel(params) {
  return request({
    url: '/position/filter/level',
    method: 'get',
    params: params
  })
}

export function getFilterParent(params) {
  return request({
    url: '/position/filter/parent',
    method: 'get',
    params: params
  })
}

export function getAllTitle() {
  return request({
    url: '/position/title',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: '/position/chart',
    method: 'get'
  })
}

export function getDanglingPosition() {
  return request({
    url: '/position/dangling_pos',
    method: 'get'
  })
}

export function restoreDeletedData(params) {
  return request({
    url: 'position/restore',
    method: 'get',
    params: params
  })
}
