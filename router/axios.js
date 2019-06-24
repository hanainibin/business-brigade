/**
 *
 * http配置
 *
 */

import axios from 'axios'
import store from '@/store/store'
import { getToken } from '@/util/auth'
import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
// 超时时间
axios.defaults.timeout = 30000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress.configure({ showSpinner: false })// NProgress Configuration
// HTTPrequest拦截
axios.interceptors.request.use(config => {
  config.url = process.env.VUE_APP_PAth + config.url
  // NProgress.start() // start progress bar
  if (store.getters.access_token) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  return Promise.reject(error)
})
// HTTPresponse拦截
axios.interceptors.response.use(data => {
  // NProgress.done()
  store.dispatch('setState', {
    key: 'timeOffset',
    value: data.data.timestamp - Date.now(),
    module: 'common'
  })
  if (data.data.code === 401) {
    let url = data.config.url
    if (url.includes('/getUserInfo')) {
      store.dispatch('QuickLogin')
    } else if (url.includes('/removeToken')) {
      // console.log(url, 'data')
    } else {
      store.dispatch('QuickLogin')
      store.dispatch('setState', {
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
      Message('身份信息已过期，请重新登录')
    }
    window.location.hash = '/'
  }
  return data
}, error => {
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    Message('网络开小差，请刷新试试~')
    return Promise.resolve(error)
  } else {
    // NProgress.done()
    if (error.response && error.response.status === 401) {
      store.dispatch('QuickLogin')
      window.location.hash = '/'
      let url = error.response.config.url
      if (url.includes('/getUserInfo') || url.includes('/removeToken')) {
        // console.log(url, 'error')
      } else {
        store.dispatch('setState', {
          key: 'dialogLoginVisible',
          value: true,
          module: 'user'
        })
        Message('身份信息已过期，请重新登录')
      }
    }
    return Promise.resolve(error.response.data)
  }
})

export default axios
