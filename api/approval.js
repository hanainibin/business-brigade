import request from '@/router/axios'
import {
  getToken
} from '@/util/auth'

export function getModel() {
  return request({
    url: '/trip/center/approval/getMode',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function getNoOk() {
  return request({
    url: '/trip/center/applicationForm/getNoOk',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function getStatus(params) {

  return request({
    url: '/trip/center/applicationForm/getStatus',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params
  })
}

export function queryTripForm() {
  return request({
    url: '/trip/center/applicationForm/queryTripForm',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
  })
}

export function detail(params) {
  return request({
    url: '/trip/center/applicationForm/detail',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function addApproval(params) {
  return request({
    url: '/trip/center/applicationForm/newTripForm',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function approvalSet(params) {
  return request({
    url: '/trip/center/approval/set',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function approvePersonList(params) {
  return request({
    url: '/trip/center/applicationForm/list',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function approveList(params) {
  return request({
    url: '/trip/center/approval/list',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}
export function getRecorde(params) {
  return request({
    url: "/trip/center/applicationForm/recorde",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function getSubList(params) {
  return request({
    url: "/trip/center/applicationForm/getSubList",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function changeStatus(params) {
  return request({
    url: "/trip/center/approval/approve",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: "/trip/center/applicationForm/update",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function newTripForm(params) {
  return request({
    url: "/trip/center/applicationForm/newTripForm",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function addPaidCheckSetting(params) {
  return request({
    url: "/trip/center/paidCheck/addPaidCheckSetting",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function addPaidCheckUser(params) {
  return request({
    url: "/trip/center/paidCheck/addPaidCheckUser",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function deletePaidCheckSetting(params) {
  return request({
    url: "/trip/center/paidCheck/updatePaidCheckSetting",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

export function selectCheckList(params) {
  return request({
    url: "/trip/center/travel/selectCheckList",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post",
    data: params
  })
}

/**
 * 获取列表
 * @param params
 */
export function getEntMembers() {
  return request({
    url: "/trip/center/setting/getEntMembers",
    headers: {
      Authorization: "Bearer " + getToken()
    },
    method: "post"
  })
}