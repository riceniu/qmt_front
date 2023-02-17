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

export function fetchLastId() {
  return request({
    url: '/vue-element-admin/product/lastid',
    method: 'get',
  })
}

export function addProduct(data) {
  return request({
    url: '/vue-element-admin/product/add',
    method: 'post',
    data
  })
}

export function deleteProduct(data) {
  return request({
    url: '/vue-element-admin/product/delete',
    method: 'delete',
    data
  })
}
export function editProduct(data) {
  return request({
    url: '/vue-element-admin/product/edit',
    method: 'post',
    data
  })
}