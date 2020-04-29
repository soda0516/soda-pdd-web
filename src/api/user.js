import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/jwt-user/login',
    method: 'post',
    params: {
      data: data
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user-info/info',
    method: 'get',
    params: {
      token: token
    }
  })
}

export function logout() {
  return request({
    url: '/jwt-user/logout',
    method: 'post'
  })
}
