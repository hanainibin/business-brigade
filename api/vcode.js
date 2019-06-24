import request from '@/router/axios'

export function sendEmailVcode (mail) {
  return request({
    url: '/trip/center/mail/sendVcode',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: {
      mail,
      type: '0'
    }
  })
}

export function sendMobileVcode (mobile) {
  return request({
    url: '/trip/center/verify/sendmsg',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: {
      mobile,
      type: '1'
    }
  })
}

export function sendPhoneCode (phone) {
  return request({
    url: '/trip/center/setting/sendPhoneCode',
    headers: {
      Authorization: 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    data: {
      phone
    }
  })
}
