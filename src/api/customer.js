import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: "/vue-element-admin/customer/contact",
    method: "get",
    params: query,
  });
}
export function fetchCompanyList(query) {
  return request({
    url: "/vue-element-admin/customer/company",
    method: "get",
    params: query,
  });
}
export function fetchProduct(id) {
  return request({
    url: "/vue-element-admin/customer/detail",
    method: "get",
    params: { id },
  });
}

export function fetchPv(pv) {
  return request({
    url: "/vue-element-admin/customer/pv",
    method: "get",
    params: { pv },
  });
}

export function createCustomer(data) {
  return request({
    url: "/vue-element-admin/customer/create",
    method: "post",
    data,
  });
}

export function updateCustomer(data) {
  return request({
    url: "/vue-element-admin/customer/update",
    method: "post",
    data,
  });
}

export function deleteCompany(data) {
  return request({
    url: "/vue-element-admin/customer/company/delete",
    method: "delete",
    data,
  });
}

export function deleteContact(data) {
  return request({
    url: "/vue-element-admin/customer/contact/delete",
    method: "delete",
    data,
  });
}

export function updateCompany(data) {
  return request({
    url: "/vue-element-admin/customer/company/update",
    method: "post",
    data,
  });
}

export function updateContact(data) {
  return request({
    url: "/vue-element-admin/customer/contact/update",
    method: "post",
    data,
  });
}

export function createContact(data) {
  return request({
    url: "/vue-element-admin/customer/contact/create",
    method: "post",
    data,
  });
}

export function createCompany(data) {
  return request({
    url: "/vue-element-admin/customer/company/create",
    method: "post",
    data,
  });
}

export function remoteSearchCompany(name) {
  return request({
    url: '/vue-element-admin/customer/company/searchByName',
    method: 'get',
    params: {name}
  })
}

export function remoteSearchContact(name) {
  return request({
    url: '/vue-element-admin/customer/contact/searchByName',
    method: 'get',
    params: {name}
  })
}

