import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function openConsole () {
  return request({
    url: '/trip/center/setting/openConsole',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
