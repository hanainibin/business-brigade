import request from '@/router/axios'
import { getToken } from '@/util/auth'

export const loginByUsername = (username, password, checkCode, randomStr) => {
  return request({
    url: '/trip/center/auth/getToken',
    method: 'post',
    params: { username, password, randomStr, checkCode }
  })
}

export const smsLogin = (mobile, code) => {
  return request({
    url: '/trip/center/user/smsLogin',
    method: 'post',
    data: { mobile, code }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/trip/center/user/getUserInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: {
      leadType: 0
    }
  })
}

export function loginOut(params) {
  return request({
    url: '/auth/authentication/removeToken',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: params
  })
}
