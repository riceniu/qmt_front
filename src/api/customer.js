import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/customer/list',
    method: 'get',
    params: query
  })
}
export function fetchCompanyList(query) {
  return request({
    url: '/vue-element-admin/customer/company',
    method: 'get',
    params: query
  })
}
export function fetchProduct(id) {
  return request({
    url: '/vue-element-admin/customer/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/customer/pv',
    method: 'get',
    params: { pv }
  })
}

export function createCustomer(data) {
  return request({
    url: '/vue-element-admin/customer/create',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/vue-element-admin/customer/update',
    method: 'post',
    data
  })
}
