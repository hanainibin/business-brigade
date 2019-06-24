import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function getInvoiceOrderList (params) {
  return request({
    url: '/trip/center/invoice/getInvoiceOrderList',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function autoQueryInvoiceInfo (params) {
  return request ({
    url: '/trip/center/invoice/autoQueryInvoiceInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: params
  })
}

export function applyInvoice (params) { 
  return request({
    url: '/trip/center/invoice/applyEInvoice',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function getInvoiceList (params) {
  return request ({
    url: '/trip/center/invoice/getInvoiceList',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function getOrderListByInvoiceId (params) {
  return request ({
    url: '/trip/center/invoice/getOrderListByInvoiceId',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function queryEntInfo (params) {
  return request ({
    url: '/trip/center/invoice/queryEntInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}
