import request from '@/router/axios'

export function wxlogin (params) {
  return request({
    url: '/trip/center/user/wxlogin',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get',
    params: params
  })
}

export function bindPhone (params) {
  return request({
    url: '/trip/center/user/bindPhone',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: params
  })
}