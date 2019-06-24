/**
 * Create by: RainingSky
 * Date: 2018/11/22 0022 16:34:36
 * Description:
 */
import request from '@/router/axios'
import { getToken } from '@/util/auth'

/**
 * 结算单列表
 * @param params
 */
export function statementList (params) {
	return request({
		url: '/trip/center/statement/statementList',
		headers: {
			Authorization: "Bearer " + getToken()
		},
		method: 'get',
		params: params
	})
}

/**
 * 结算单确认
 * @param params
 */
export function statementCheck (params) {
	return request({
		url: '/trip/center/statement/statementCheck',
		headers: {
			Authorization: "Bearer " + getToken()
		},
		method: 'get',
		params: params
	})
}

/**
 * 结算单订单列表
 * @param params
 */
export function statementOrderList (params) {
	return request({
		url: '/trip/center/statement/statementOrderList',
		headers: {
			Authorization: "Bearer " + getToken()
		},
		method: 'get',
		params: params
	})
}