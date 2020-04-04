import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/accesorycategory/list',
    method: 'get',
    params: params
  })
}
export function createAccessory(data) {
  return request({
    url: '/accesorycategory/create',
    method: 'post',
    data: data
  })
}
export function updateShowStatus(data) {
  return request({
    url: '/accesorycategory/update/enabled',
    method: 'post',
    data: data
  })
}

export function deleteAccessory(id) {
  return request({
    url: '/accesorycategory/delete/' + id,
    method: 'get'
  })
}

export function getAccessory(id) {
  return request({
    url: '/accesorycategory/detail?id=' + id,
    method: 'get'
  })
}

export function updateAccessory(data) {
  return request({
    url: '/accesorycategory/update',
    method: 'post',
    data: data
  })
}

