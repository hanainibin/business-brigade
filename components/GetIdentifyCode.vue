<template>
  <button class="button-getIdentifyCode" :disabled="isDisabled" @click.prevent="handleExit"
          :class="isDisabled ? 'not-allowed' : ''">{{buttonText}}</button>
</template>

<script>
import { sendEmailVcode, sendMobileVcode, sendPhoneCode } from '@/api/vcode.js'
import { validateEmail, isPhoneAvailable } from '@/util/validate.js'
import { checkAccount } from '@/api/ent.js'

export default {
  name: 'GetIdentifyCode',
  props: {
    code: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false
    },
    components: {
      type: String,
      required: false
    },
    isLogin: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      buttonText: '获取验证码',
      isDisabled: false,
      countNum: 60
    }
  },
  methods: {
    countDown() {
      this.isDisabled = true
      this.buttonText = `重新发送(${this.countNum})`
      let timer = setInterval(() => {
        this.countNum -= 1
        this.buttonText = `重新发送(${this.countNum})`
        if(this.countNum === 0){
          clearInterval(timer)
          this.isDisabled = false
          this.buttonText = '获取验证码'
          this.countNum = 60
        }
      }, 1000)
    },
    mobileCode() {
      sendMobileVcode(this.code).then( res => {
        if(res.data.code === 0){
          this.$message({
            message: '验证码已发送至您的手机',
            type: 'success'
          })
          this.countDown()
        }else{
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    emailCode () {
      sendEmailVcode(this.code).then( res => {
        if(res.data.code === 0) {
          this.$message({
            message: '验证码已发送至您的邮箱',
            type: 'success'
          })
          this.countDown()
        }else{
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    phoneCode () {
      sendPhoneCode(this.code).then( res => {
        if(res.data.code === 0){
          this.$message({
            message: '验证码已发送至您的手机',
            type: 'success'
          })
          this.countDown()
        }else{
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    handleExit() {
      if(this.code.replace(/(^\s*)|(\s*$)/g, "") === "") {
				if(this.$route.name === 'CompanyRegister') {
          if (this.isLogin) return this.$message.error('请先输入手机号码')
					return this.$message.error('请先输入企业邮箱')
        }
        if (this.type === 'phone' && this.$route.name === 'MyAccount') {
          return this.$message.error('请输入手机号')
        }
        if (this.type === 'email' && this.$route.name === 'MyAccount') {
          return this.$message.error('请输入邮箱账号')
        }
        if (this.type === undefined) {
          return this.$message.error('请输入手机号或邮箱')
        }
        // console.log(this.type)
        return this.$message.error('请正确输入')
      }
      // console.log(this.components)
      if(this.components === 'LoginModal') {
        if(isPhoneAvailable(this.code)) {
          return this.phoneCode()
        } else {
          return this.$message.error('请输入正确手机号码')
        }
      } else {
        if(this.code !== '' && !isNaN(this.code)) {
          if(isPhoneAvailable(this.code)) {
            if(this.$route.name === 'MyAccount') {
              if(this.type === 'phone') {
                checkAccount({
                  accountInfo: this.code
                }).then(res => {
                  if(res.data.data === false){
                    return this.$message.error('该手机号已存在，请重新输入')
                  }else{
                    return this.phoneCode()
                  }
                })
              } else {
                return this.$message.error('请输入邮箱')
              }
            } else {
              checkAccount({
                accountInfo: this.code
              }).then(res => {
                if(this.$route.name === 'ForgotPassword') {
                  if(res.data.data === true){
                    return this.$message.error('该账号不存在，请重新输入')
                  }else{
                    return this.mobileCode()
                  }
                } else if(this.$route.name === 'home') {
                  return this.phoneCode()
                } else if(this.$route.name === 'CompanyRegister') {
                  return this.$message.error('请输入正确的邮箱账号，如example@163.com')
                }
              })
            }
          } else if(this.$route.name === 'CompanyRegister') {
            return this.$message.error('请输入正确的邮箱账号，如example@163.com')
          } else {
            return this.$message.error('请输入正确手机号码')
          }
        } else {
          if(validateEmail(this.code)) {
            checkAccount({
              accountInfo: this.code
            }).then(res =>{
              if(this.$route.name === 'CompanyRegister'){
                if(res.data.data === false){
                  this.$message.error('您的邮箱账号已被注册，请找回密码或更换新邮箱。')
                }else{
                  return this.emailCode()
                }
              } else if(this.$route.name === 'ForgotPassword') {
                if(res.data.data === true){ // 此接口返回true代表未注册
                  return this.$message.error('该账号不存在，请重新输入')
                }else{
                  return this.emailCode()
                }
              }
              if (this.$route.name === 'MyAccount') {
                if (res.data.data === false) {
                  return this.$message.error('您的邮箱账号已被注册，请找回密码或更换新邮箱')
                } else {
                  if(this.type === 'email') {
                    return this.emailCode()
                  } else {
                    return this.$message.error('请输入手机号')
                  }
                }
              }
            })
          }else{
            return this.$message.error('请输入正确的邮箱账号，如example@163.com')
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .button-getIdentifyCode{
    width: 95px;
    height: 35px;
    line-height: 35px;
    border: 0.5px solid #4a90e2;
    border-radius: 4px;
    color: #4a90e2;
    text-align: center;
    font-size: 15px;
    background-color: #fff;
    outline: none;
    &:hover{
      background-color: #4a90e2;
      color: #fff;
      cursor: pointer;
    }
    &:hover.not-allowed{
      cursor: not-allowed;
    }
  }
</style>
