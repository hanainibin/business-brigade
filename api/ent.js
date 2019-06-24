import request from '@/router/axios'

export function saveEnt (params) {
  return request({
    url: '/trip/center/ent/saveEnt',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: params
  })
}

export function checkAccount (params) {
  return request({
    url: '/trip/center/setting/checkAccount',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'get',
    params: params
  })
}
