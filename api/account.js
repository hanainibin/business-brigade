import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function getAccountInfo(accountId) {
  return request({
    url: '/trip/center/setting/accountInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: {
      id: accountId,
    }
  })
}

export function updateAccountInfo(params) {
  return request({
    url: '/trip/center/setting/updateAccountInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: {
      ...params,
			channelInvestCode: params.channelInvestCode != '' ? params.channelInvestCode : 'TZ0000',
    }
  })
}

export function getEmployeeByPhne(phone) {
  return request({
    url: '/trip/center/setting/searchEmplyeeByPhone',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: {
      phone,
    }
  })
}

export function inviteEmployee(accountId, userName,userPhone) {
  return request({
    url: '/trip/center/setting/inviteEmployee',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: {
      accountId,
      userName,
      userPhone,
    }
  })
}

export function getEmployeeInfo(params) {
  return request({
    url: '/trip/center/setting/entMemberInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function deleteEmployee(accountId, userId) {
  return request({
    url: '/trip/center/setting/deleteEmplyeeByUserid',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: {
			accountId,
      userId,
    }
  })
}

export function updateInfoCheckPassword(accountInfo, password) {
	return request({
		url: '/trip/center/setting/updateEmailCheckPassword',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: {
			accountInfo,
			password,
		}
	})
}
