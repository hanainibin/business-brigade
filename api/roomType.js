import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function load (params) {
  return request({
    url: '/trip/center/roomType/load',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function price (params) {
  return request({
    url: '/trip/center/roomType/price',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}
