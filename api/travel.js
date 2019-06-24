/**
 * Create by: RainingSky
 * Date: 2018/11/12 0012 14:24:38
 * Description:
 */
import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function initTravelList(params) {
	return request({
		url: '/trip/center/travel/selectTravels',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: params
	})
}

export function checkTravel(params) {
	return request({
		url: '/trip/center/travel/checkTravel',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: params
	})
}

export function addTravel(params) {
	return request({
		url: '/trip/center/travel/addTravel',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: params
	})
}

/**
 * 获取出差申请列表
 * @param params
 */
export function getTraves() {
	return request({
		url: '/trip/center/travel/selectApplyNos',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post'
	})
}

/**
 * 查询审核人列表
 * @param params
 */
export function selectCheckList() {
	return request({
		url: '/trip/center/travel/selectCheckList',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post'
	})
}

/**
 * 根据条件查询行程列表
 * @param params
 */
export function selectTravelBy(params) {
	return request({
		url: '/trip/center/travel/selectTravelBy',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: params
	})
}

export function getEntMembers() {
	return request({
		url: "/trip/center/setting/getEntMembers",
		headers: {
			Authorization: "Bearer " + getToken()
		},
		method: "post"
	})
}