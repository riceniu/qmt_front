import request from '@/utils/request'

export function remoteSearchContact(name) {
  return request({
    url: '/vue-element-admin/HSapi/searchContact',
    method: 'get',
    params: {name}
  })
}

export function remoteSearchCompany(name) {
  return request({
    url: '/vue-element-admin/HSapi/searchCompany',
    method: 'get',
    params: {name}
  })
}