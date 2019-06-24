import request from '@/router/axios'
import { getToken } from '@/util/auth'

export function forgotPwd(accountInfo, passWord, vcode) {
  return request({
    url: '/trip/center/setting/forgotPassword',
    headers: {
      'Authorization': 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: {
      accountInfo,
      passWord,
      vcode
    }
  })
}

export function updatePwd(userId, userType, newPassword, oldPassword) {
  return request({
    url: '/trip/center/setting/updatePassword',
    headers: {
      Authorization: 'Bearer ' + getToken()
    },
    method: 'post',
    data: {
      userId,
      userType,
      oldPassword,
      newPassword,
    }
  })
}