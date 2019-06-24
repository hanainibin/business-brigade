import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function getMessage(userId) {
	return request({
		url: '/trip/center/message/getMessage',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'get',
		params: {
			userId
		}
	})
}

export function isAgreeMessage(isAgree, messageId, userId) {
	return request({
		url: '/trip/center/message/isAgreeMessage',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: {
			isAgree,
			messageId,
			userId,
		}
	})
}