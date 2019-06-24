import request from '@/router/axios'
import { getToken } from '@/util/auth'

// 岗级列表
export function entQueryList () {
  return request({
    url: '/trip/center/position/entQueryList',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
// 住宿标准列表
export function hotelListQuery () {
  return request({
    url: '/trip/center/standard/hotelListQuery',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
// 机票标准列表
export function flightListQuery () {
  return request({
    url: '/trip/center/standard/flightListQuery',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
// 住宿标准详情
export function hotelDetailQuery (data) {
  return request({
    url: '/trip/center/standard/hotelDetailQuery',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: data
  })
}
// 岗级详情
export function entQueryDetails (data) {
  return request({
    url: 'trip/center/position/entQueryDetails',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: data
  })
}
// 岗级相关的员工列表
export function queryEmployee(data) {
  return request({
    url: 'trip/center/position/queryEmployee',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: data
  })
}
// 岗级删除
export function entClose(data) {
  return request({
    url: 'trip/center/position/entClose',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: data
  })
}
// 岗级新增
export function entNew(data) {
  return request({
    url: 'trip/center/position/entNew',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: data
  })
}
// 岗级员工批量绑定
export function employeeBinding(data) {
  return request({
    url: 'trip/center/position/employeeBinding',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}
// 岗级修改
export function entModify(data) {
  return request({
    url: 'trip/center/position/entModify',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}
// 修改住宿标准
export function hotelModify(data) {
  return request({
    url: 'trip/center/standard/hotelModify',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}
// 新增住宿标准
export function hotelNew(data) {
  return request({
    url: 'trip/center/standard/hotelNew',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}
// 查询城市分类列表
export function cityTagList() {
  return request({
    url: 'trip/center/standard/cityTagList',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
// 修改城市分类
export function cityModify(data) {
  return request({
    url: 'trip/center/standard/cityModify',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}
// 新增机票标准
export function flightNew (data) {
  return request({
    url: '/trip/center/standard/flightNew',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}
// 修改机票标准
export function flightModify (data) {
  return request({
    url: '/trip/center/standard/flightModify',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}