import request from '@/utils/request'

export function login(data) {
  return request({
    //url: '/user/admin',
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    //url: '/user/admin/get',
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/user/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/vue-element-admin/user/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/user/pv',
    method: 'get',
    params: { pv }
  })
}

export function addUser(data) {
  return request({
    url: '/vue-element-admin/user/create',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/vue-element-admin/user/update',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/vue-element-admin/user/update',
    method: 'post',
    data
  })
}