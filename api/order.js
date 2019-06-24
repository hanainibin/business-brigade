import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function doorder (params) {
  return request({
    url: '/trip/center/order/doorder',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function toBooking (params) {
  return request({
    url: 'flight/flight/toBooking',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function doAirOrder (params) {
  return request({
    url: 'flight/flight/createOrder',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function searchInsurances (params) {
  return request({
    url: 'flight/flight/searchInsurances',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function pay (params) {
  return request({
    url: '/trip/center/order/pay',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: params
  })
}

export function getOrderList (params) {
  return request({
    url: '/trip/center/order/getInvoiceOrderList',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function queryOrderList (params) {
  return request({
    url: '/flight/order/queryOrderList',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function deleteOrder (params) {
  return request({
    url: '/trip/center/order/deleteOrder',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: params
  })
}
