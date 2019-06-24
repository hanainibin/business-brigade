import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function tzHotels () {
  return request({
    url: '/trip/center/tzHotels',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: {
      'limit': 0,
      'type': '0'
    }
  })
}

export function getCityList() { 
  return request({
    url: '/trip/center/city/ctiysList',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get'
  })
}

export function cityDetail(city) {
  return request({
    url: '/trip/center/city/cityDetail',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: {
      'cityName': city
    }
  })
}

export function loadList(params) { 
  return request({
    url: '/trip/center/es/searchHotelListByCityId',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}

export function saveReserve(params) {
	return request({
		url: '/trip/center/ent/entMeeting',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: params
	})
}

export function savePermanentRoom(params) {
	return request({
		url: '/trip/center/ent/entPermanentRoom',
		headers: {
			Authorization: 'Bearer ' + getToken()
		},
		method: 'post',
		data: params
	})
}

export function flyList(params) { 
  return request({
    url: 'flight/flight/searchFlights',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post', 
    data: params
  })
}

export function getAirCityList() { 
  return request({
    url: '/citys.json',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get'
  })
}

export function searchFlightInfo (params) {
  return request({
    url: '/flight/flight/searchFlightInfo',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: params
  })
}
