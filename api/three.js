import request from '@/router/axios'

export function login (params) {
  return request({
    url: '/trip/center/three/login',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get',
    params: params
  })
}