import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function createOrder (params) {
  return request({
    url: '/trip/center/pay/createOrder',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: params
  })
}

export function getPayStatus (orderNo) {
  return request({
    url: '/trip/center/pay/getPayStatus',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: {
      orderNo: orderNo
    }
  })
}

export function getPayType (params) {
  return request({
    url: '/trip/center/pay/getPayType',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: params
  })
}

export function createFlyOrder (params) {
  return request({
    url: '/flight/pay/createOrder',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function getFlyPayStatus (params) {
  return request({
    url: 'flight/pay/getPayStatus',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params
  })
}

export function queryOrderInfo (params) {
  return request({
    url: 'flight/order/queryOrderInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}
