import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function oneHotelInfo (id) {
  return request({
    url: '/trip/center/hotel/oneHotelInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    params: {
      hotelId: id
    }
  })
}

export function selectOneHotelInfoById (id) {
  return request({
    url: '/trip/center/es/selectOneHotelInfoById',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get',
    params: {
      id
    }
  })
}

export function searchRecommendHotelListByLocation (data) {
  return request({
    url: '/trip/center/es/searchRecommendHotelListByLocation',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data
  })
}

export function selectSupremeHotel (data) {
  return request({
    url: '/trip/center/hotel/selectSupremeHotel',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data
  })
}

export function getLocalCity () {
  return request({
    url: '/trip/center/city/getLocalCity',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get'
  })
}
