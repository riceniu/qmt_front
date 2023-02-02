import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/product/list',
    method: 'get',
    params: query
  })
}

export function fetchProduct(id) {
  return request({
    url: '/vue-element-admin/product/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/product/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/product/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/product/update',
    method: 'post',
    data
  })
}
