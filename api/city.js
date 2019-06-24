import request from '@/router/axios'

export function getBusiZoneList (params) {
  return request({
    url: '/trip/center/city/getBusiZoneList',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get',
    params: params
  })
}

export function getCities () {
  return request({
    url: '/trip/center/city/getCities',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get'
  })
}