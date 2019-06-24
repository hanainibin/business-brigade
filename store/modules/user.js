
import { setToken, removeToken } from '@/util/auth'
import { setStore, getStore, removeStore } from '@/util/store'
import { loginByUsername, smsLogin, getUserInfo, loginOut } from '@/api/login'
import { Message } from 'element-ui'

const user = {
  state: {
    dialogLoginVisible: false,
    userInfo: getStore({
      name: 'userInfo'
    }) || {},
    access_token: getStore({
      name: 'access_token'
    }) || '',
    refresh_token: getStore({
      name: 'refresh_token'
    }) || '',
    nickName: '',
    accountId: '',
    accountType: -1,
    bindMobileDialogVisible: false,
    wechatId: getStore({
      name: 'wechatId'
    }) || ''
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: state.userInfo
      })
    },
    SET_NICK_NAME: (state, data) => {
      state.nickName = data.nickName || ''
      state.accountId = data.id || ''
      state.accountType = data.accountType
    }
  },
  actions: {
    LoginByUsername({ dispatch }, { userInfo, router, isAccountLogin }) {
      return new Promise((resolve, reject) => {
        if(isAccountLogin) {
          loginByUsername(userInfo.username, userInfo.password, userInfo.code, userInfo.randomStr).then(response => {
            const data = response.data
            if (data && data.code === 0) {
              dispatch('LoginSuccess', {
                data: data.data,
                router: router
              })
              resolve(data.data)
            } else if (data && data.code === 1) {
              reject(data.msg)
            }
          }).catch(error => {
            reject(error)
          })
        } else {
          smsLogin(userInfo.phone, userInfo.code).then(response => {
            const data = response.data
            if (data && data.code === 0) {
              console.log(data)
              dispatch('LoginSuccess', {
                data: data.data,
                router: router
              })
              resolve(data.data)
            } else if (data && data.code === 1) {
              reject(data.msg)
            }
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    GetUserInfo({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data.data
          if (response.data.code === 3) {
            if (response.data.msg.length > 0) {
              Message(response.data.msg)
              dispatch('QuickLogin')
            }
          } else {
            commit('SET_NICK_NAME', data)
          }
          resolve(response)
        }).catch(error => {
          dispatch('QuickLogin')
          reject(error)
        })
      })
    },
    QuickLogin({ state, commit }) {
      removeStore({
        name: 'userInfo'
      })
      state.userInfo = {}
      state.wechatId = ''
      removeStore({
        name: 'wechatId'
      })
      commit('SET_NICK_NAME', {})
      return new Promise((resolve, reject) => {
        loginOut({
          accesstoken: getStore({ name: 'access_token' }),
          refreshToken: getStore({ name: 'refresh_token' })
        }).then(res => {
          removeStore({
            name: 'access_token'
          })
          removeStore({
            name: 'refresh_token'
          })
          removeToken()
          resolve(res)
        }).catch(err => {
          removeStore({
            name: 'access_token'
          })
          removeStore({
            name: 'refresh_token'
          })
          removeToken()
          reject(err)
        })
      })
    },
    LoginSuccess({ state, commit, dispatch }, {
      data,
      router
    }) {
      setToken(data.access_token)
      state.wechatId = ''
      removeStore({
        name: 'wechatId'
      })
      commit('SET_ACCESS_TOKEN', data.access_token)
      commit('SET_REFRESH_TOKEN', data.refresh_token)
      commit('SET_USER_INFO', data.user)
      dispatch('GetUserInfo').then(() => {
        router.replace('/')
      })
    }
  }
}

export default user
