import request from '@/router/axios'

export function unionSearch (params) {
  return request({
    url: '/trip/center/es/keyWordUnionSearch',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: params
  })
}