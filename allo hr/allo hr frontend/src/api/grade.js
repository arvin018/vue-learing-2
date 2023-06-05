import request from '@/utils/request'

export function getListGrade(params) {
  return request({
    url: '/grade',
    method: 'get',
    params
  })
}

export function addGrade(datas) {
  return request({
    url: '/grade/save',
    method: 'post',
    data: datas
  })
}

export function deleteGrade(params) {
  return request({
    url: '/grade/delete',
    method: 'delete',
    params: params
  })
}

export function getSingleGrade(params) {
  return request({
    url: '/grade/getSingleGrade',
    method: 'get',
    params
  })
}

export function updateGrade(datas) {
  return request({
    url: '/grade/update',
    method: 'put',
    data: datas
  })
}
