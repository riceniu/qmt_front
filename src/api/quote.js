import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/quote/list',
    method: 'get',
    params: query
  })
}

export function fetchQuote(quote_number) {
  return request({
    url: '/vue-element-admin/quote/detail',
    method: 'get', 
    params: query
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

export function fetchQuoteItemsList(query) {
  return request({
    url: '/vue-element-admin/quote/items/list',
    method: 'get', 
    params: query
  })
}

export function fetchQuoteItems(query) {
  return request({
    url: '/vue-element-admin/quote/items',
    method: 'get', 
    params: query
  })
}

export function deleteQuote(data) {
  return request({
    url: '/vue-element-admin/quote/delete',
    method: 'delete',
    data
  })
}

export function getLatestQuoteNumber() {
  return request({
    url: '/vue-element-admin/quote/getLatestQuoteNumber',
    method: 'get', 
  })
}

export function checkQuoteNumber(query) {
  return request({
    url: '/vue-element-admin/quote/number',
    method: 'get', 
    params: query
  })
}