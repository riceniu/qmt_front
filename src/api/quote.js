import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/quote/list',
    method: 'get',
    params: query
  })
}

export function fetchQuote(id) {
  return request({
    url: '/vue-element-admin/quote/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/quote/pv',
    method: 'get',
    params: { pv }
  })
}

export function createQuote(data) {
  return request({
    url: '/vue-element-admin/quote/create',
    method: 'post',
    data
  })
}

export function updateQuote(data) {
  return request({
    url: '/vue-element-admin/quote/update',
    method: 'post',
    data
  })
}
