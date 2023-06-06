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

export function productCatalog() {
  return request({
    url: '/vue-element-admin/HSapi/getProductCatalog',
    method: 'get',
  })
}

export function getHSOwnerList() {
  return request({
    url: '/vue-element-admin/HSapi/getOwnerList',
    method: 'get',
  })
}

export function checkExisting(data) {
  return request({
    url: "/vue-element-admin/HSapi/checkExisting",
    method: "post",
    data,
  });
}

export function postDeal(data) {
  return request({
    url: "/vue-element-admin/HSapi/postDeal",
    method: "post",
    data,
  });
}

